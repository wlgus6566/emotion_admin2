import Router from "next/router"
import {useApiPost} from "@/hook/useAxios"
import DefaultsLayout from "@/layouts/defaults"
import PageTitle from "@/components/global/page-title"
import Button from "@/components/global/button"
import {useEffect, useState} from 'react'
import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Textarea from "@/components/global/Textarea";
import Input from "@/components/global/Input";
import File from "@/components/global/File";
import Datepicker from "@/components/global/Datepicker";

export default function MagazineWrite() {
    const schema = yup.object().shape({
        pcTitle: yup.string().required('필수 입력'),
        moTitle: yup.string().required('필수 입력'),
        description: yup.string().required('필수 입력'),
        contents: yup.string().required('필수 입력'),
        writerDepartment: yup.string().required('필수 입력'),
        writeDt: yup.string().required('필수 입력'),
        writerJobRank: yup.string().required('필수 입력'),
        contentsImageFileList: yup.array().min(1, '필수 입력').max(20, '필수 입력'),
        pcKeyImageFileList: yup.array().min(1, '필수 입력').max(1, '필수 입력'),
        moDetailKeyImageFileList: yup.array().min(1, '필수 입력').max(1, '필수 입력'),
        pcWriterImageFileList: yup.array().min(1, '필수 입력').max(1, '필수 입력'),
        moWriterImageFileList: yup.array().min(1, '필수 입력').max(1, '필수 입력'),
    })
    const {
        control,
        handleSubmit,
        getValues,
        setValue,
        watch,
        formState: {errors, isDirty, isValid}
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
            pcTitle: "",
            moTitle: "",
            description: "",
            contents: "",
            writerDepartment: "",
            writeDt: "",
            writerJobRank: "",
            contentsImageFileList: [],
            pcKeyImageFileList: [],
            moKeyImageFileList: [],
            pcDetailKeyImageFileList: [],
            moDetailKeyImageFileList: [],
            pcWriterImageFileList: [],
            moWriterImageFileList: [],
        }
    })

    const [formData, setFormData] = useState({
        pcTitle: "",
        moTitle: "",
        description: "",
        contents: "",
        writerDepartment: "",
        writeDt: "",
        writerJobRank: "",
        contentsImageFileList: [],
        pcKeyImageFileList: [],
        moKeyImageFileList: [],
        pcDetailKeyImageFileList: [],
        moDetailKeyImageFileList: [],
        pcWriterImageFileList: [],
        moWriterImageFileList: [],
    })

    // 작성일시 입력값을 서버가 요구하는 형식으로 변환하는 함수
    const handleDateFormat = (date) => {
        const year = date.getFullYear().toString().slice(-2); // 2자리 연도
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // 2자리 월
        const day = ('0' + date.getDate()).slice(-2); // 2자리 일
        const returnDate = `${year}-${month}-${day}`
        return returnDate
    }

    // 본문 내 이미지 경로를 업로드된 파일 경로로 수정하는 함수
    const handleContentsImgSrcChange = (arr, data) => {
        /*
                                                    <img :src="require('@/assets/images/mag/img1 - 복사본.jpg')" alt="방 어피니티 다이어그램" />
                                                    <div>방 어피니티 다이어그</div>
                                                   <br><br>  <img :src="require('@/assets/images/mag/img0.jpg')" alt="다이어그램" />
                                                 */
        let contents2 = data.contents || ''
        arr.forEach((ar) => {
            const {filePath, fileName} = ar
            const pattern = new RegExp(`<img.*?${fileName}.*?\\/>`)
            const match = contents2.match(pattern)[0]
            const modifiedTag = match.replace(/:src=".*?"/, `src="${filePath}"`)
            contents2 = contents2.replace(match, modifiedTag)
        })
        return contents2
    }

    // 파일 업로드 처리 함수
    const filesUpload = async (data, name) => {
        try {
            const fileArr = data[name]
            const form = new FormData()
            fileArr.forEach((el) => {
                form.append("files", el)
            })
            const response = await useApiPost(
                `${process.env.BASE_URL}/api/file/uploads`,
                form
            )
            if (response.data.code === "SUC001") {
                const arr = await response.data.data.map((el) => {
                    return {
                        fileName: el.fileName,
                        fileSize: el.fileSize,
                        filePath: el.filePath,
                        fileExtensionName: el.fileExtensionName,
                    }
                })
                data[name] = arr
                if (name == "contentsImageFileList") {
                    data.contents = handleContentsImgSrcChange(arr, data)
                }
            } else {
                throw response
            }
        } catch (e) {
            console.log("filesUploadError", e)
            return false
        }
    }

    // 전체 폼 제출 처리 함수
    const handleSubmitForm = async (data) => {
        console.log(data)
        try {
            await Promise.all(
                [
                    "contentsImageFileList",
                    "pcKeyImageFileList",
                    "moKeyImageFileList",
                    "pcDetailKeyImageFileList",
                    "moDetailKeyImageFileList",
                    "pcWriterImageFileList",
                    "moWriterImageFileList",
                ].map(async (name) => {
                    await filesUpload(data, name)
                })
            )
            const date = new Date(data.writeDt);
            data.writeDt = handleDateFormat(date);
            await formSubmit()
        } catch (error) {
            console.error(error)
        }
    }
    const formSubmit = async (data) => {
        try {
            const res = await useApiPost(
                `${process.env.BASE_URL}/api/magazine`,
                data
            )
            if (res.data.code === "SUC001") {
                console.log(res)
                alert("성공적으로 등록되었습니다.")
                await Router.push("/magazine", undefined, {shallow: true})
            }
        } catch (e) {
            console.log(e)
        }
    }
    const handleFormChange = async (val, name) => {
        setFormData({...formData, [name]: val})
    }
    const resetForm = () => {
        setFormData({
            pcTitle: "",
            moTitle: "",
            description: "",
            contentsImageFileList: [],
            contents: "",
            writerDepartment: "",
            writeDt: new Date(),
            writerJobRank: "",
            pcKeyImageFileList: [],
            moKeyImageFileList: [],
            pcDetailKeyImageFileList: [],
            moDetailKeyImageFileList: [],
            pcWriterImageFileList: [],
            moWriterImageFileList: [],
            useYn: "Y",
        })
    }
    return (
        <div>
            <PageTitle title="Magazine 관리"/>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-10 bg-white">
                <form onSubmit={handleSubmit(handleSubmitForm)}>
                    <div className="mb-6">
                        <Input
                            name="pcTitle"
                            label="PC 제목"
                            required={true}
                            control={control}
                            className="w-full"
                            placeholder="PC 제목을 입력해주세요."
                        />

                    </div>
                    <div className="mb-6">
                        <Input
                            name="moTitle"
                            label="MO 제목"
                            required={true}
                            control={control}
                            className="w-full"
                            placeholder="MO 제목을 입력해주세요."
                        />

                    </div>
                    <div className="mb-6">
                        <Textarea
                            name="description"
                            label="설명"
                            control={control}
                            placeholder="설명을 입력하세요."
                            resize={true}
                        />

                    </div>

                    <div className="my-20">
                        <h4 className="text-lg font-semibold">본문</h4>
                        <div className="border-y-2 border-y-black p-4 my-4">
                            <div className="mb-6">
                                <File
                                    name="contentsImageFileList"
                                    label="본문 첨가이미지"
                                    required={true}
                                    multiple={true}
                                    control={control}
                                    maxLength={20}
                                />

                            </div>
                            <div className="mb-6">
                                <Textarea
                                    name="contents"
                                    label="본문"
                                    rows={20}
                                    control={control}
                                    placeholder="본문을 입력하세요."
                                    resize={true}
                                />

                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <Input
                            name="writerDepartment"
                            label="작성자 부서명"
                            required={true}
                            control={control}
                            placeholder="작성자 부서명을 입력해주세요."
                        />

                        <Datepicker
                            name="writeDt"
                            label="작성일자"
                            control={control}
                            required={true}
                            range={false}
                            placeholder="날짜 선택"
                        />

                    </div>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <Input
                            name="writerJobRank"
                            label="작성자 직책"
                            required={true}
                            control={control}
                            placeholder="작성자 직책을 입력해주세요."
                        />
                        <Input
                            name="writerName"
                            label="작성자명"
                            required={true}
                            control={control}
                            placeholder="작성자명을 입력해주세요."
                        />
                        {/*       <FormInput
                            value={formData.writerJobRank}
                            onChange={(val) => handleFormChange(val, "writerJobRank")}
                            name="writerJobRank"
                            placeholder="작성자 직책"
                            label="작성자 직책"
                        />
                        <FormInput
                            value={formData.writerName}
                            onChange={(val) => handleFormChange(val, "writerName")}
                            name="writerName"
                            placeholder="작성자명"
                            label="작성자명"
                        />*/}
                    </div>
                    <hr className="my-10"/>

                    {/* 이미지 업로드 */}
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <File
                            name="pcKeyImageFileList"
                            label="PC 목록 썸네일 이미지"
                            required={true}
                            multiple={true}
                            control={control}
                            maxLength={1}
                        />
                        <File
                            name="moKeyImageFileList"
                            label="MO 목록 썸네일 이미지"
                            required={true}
                            multiple={true}
                            control={control}
                            maxLength={1}
                        />
                    </div>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <File
                            name="pcDetailKeyImageFileList"
                            label="PC 본문 이미지"
                            required={true}
                            multiple={true}
                            control={control}
                            maxLength={1}
                        />
                        <File
                            name="moDetailKeyImageFileList"
                            label="MO 본문 이미지"
                            required={true}
                            multiple={true}
                            control={control}
                            maxLength={1}
                        />
                    </div>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <File
                            name="pcWriterImageFileList"
                            label="PC 작성자 이미지"
                            required={true}
                            multiple={true}
                            control={control}
                            maxLength={1}
                        />
                        <File
                            name="moWriterImageFileList"
                            label="MO 작성자 이미지"
                            required={true}
                            multiple={true}
                            control={control}
                            maxLength={1}
                        />
                    </div>
                    <div className="flex justify-end mt-6 space-x-2">
                        <Button
                            type="submit"
                            name="업로드 하기"
                            size="md"
                            color="primary"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

MagazineWrite.layout = DefaultsLayout
