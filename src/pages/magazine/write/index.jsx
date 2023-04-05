import Router from "next/router"
import {useApiPost} from "@/hook/useAxios"
import DefaultsLayout from "@/layouts/defaults"
import PageTitle from "@/components/global/page-title"
import FormInput from "@/components/global/form-input"
import FormTextarea from "@/components/global/form-textarea"
import FormDatepicker from "@/components/global/form-datepicker"
import FormFile from "@/components/global/form-file"
import Button from "@/components/global/button"
import {useEffect, useState} from 'react'
import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Textarea from "@/components/global/Textarea";
import Input from "@/components/global/Input";
import File from "@/components/global/File";

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
    const handleDateFormat = () => {
        /*    let val = formData["writeDt"]
                                        console.log(val)
                                        const year = val.getFullYear().toString()
                                        const month = (val.getMonth() + 1).toString().padStart(2, "0")
                                        const day = (val.getDay() + 1).toString().padStart(2, "0")
                                        formData["writeDt"] = `${year}-${month}-${day}`*/
        formData["writeDt"] = "2022-03-02"
    }

    // 본문 내 이미지 경로를 업로드된 파일 경로로 수정하는 함수
    const handleContentsImgSrcChange = (arr) => {
        /*
                                                    <img :src="require('@/assets/images/mag/img1 - 복사본.jpg')" alt="방 어피니티 다이어그램" />
                                                    <div>방 어피니티 다이어그</div>
                                                   <br><br>  <img :src="require('@/assets/images/mag/img0.jpg')" alt="다이어그램" />
                                                 */
        let contents = formData["contents"] || ""
        arr.forEach((ar) => {
            const {filePath, fileName} = ar
            const pattern = new RegExp(`<img.*?${fileName}.*?\\/>`)
            const match = contents.match(pattern)[0]
            const modifiedTag = match.replace(/:src=".*?"/, `src="${filePath}"`)
            contents = contents.replace(match, modifiedTag)
        })
        formData.contents = contents
        console.log("formData", formData)
    }

    // 파일 업로드 처리 함수
    const filesUpload = async (name) => {
        try {
            const fileArr = formData[name]
            const form = new FormData()
            fileArr.forEach((el) => {
                form.append("files", el)
            })
            console.log("form", form)
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
                if (name == "contentsImageFileList") {
                    handleContentsImgSrcChange(arr)
                }
                formData[name] = arr
            } else {
                throw response
            }
        } catch (e) {
            console.log("filesUploadError", e)
            return false
        }
    }

    // 전체 폼 제출 처리 함수
    const handleSubmit2 = async (event) => {
        try {
            event.preventDefault()
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
                    await filesUpload(name)
                })
            )
            handleDateFormat()
            await formSubmit()
        } catch (error) {
            console.error(error)
        }
    }
    const formSubmit = async () => {
        try {
            const res = await useApiPost(
                `${process.env.BASE_URL}/api/magazine`,
                formData
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
                <form onSubmit={handleSubmit(handleSubmit2)}>
                    <div className="mb-6">
                        <Input
                            name="pcTitle"
                            label="PC 제목"
                            required={true}
                            control={control}
                            className="w-full"
                            placeholder="PC 제목을 입력해주세요."
                        />
                        {/*      <FormInput
              value={formData.pcTitle}
              onChange={(val) => handleFormChange(val, "pcTitle")}
              name="pcTitle"
              placeholder="PC 제목을 입력하세요."
              label="PC 제목"
            />*/}
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
                        {/*  <FormInput
              value={formData.moTitle}
              onChange={(val) => handleFormChange(val, "moTitle")}
              name="moTitle"
              placeholder="MO 제목을 입력하세요."
              label="MO 제목"
            />*/}
                    </div>
                    <div className="mb-6">
                        <Textarea
                            name="description"
                            label="설명"
                            control={control}
                            placeholder="설명을 입력하세요."
                            resize={true}
                        />
                        {/*    <FormTextarea
              value={formData.description}
              onChange={(val) => handleFormChange(val, "description")}
              name="description"
              placeholder="설명을 입력하세요."
              label="설명"
            />*/}
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
                                    description={
                                        <>
                                            <span className="text-primary">000*000</span>, 최대 10개까지
                                            등록 가능 jpg, png, 최대 1MB
                                        </>
                                    }
                                />
                                {/*    <FormFile
                  value={formData.contentsImageFileList}
                  onChange={(val) =>
                    handleFormChange(val, "contentsImageFileList")
                  }
                  max="10"
                  multiple={true}
                  label="본문 첨가이미지"
                />*/}
                            </div>
                            <div className="mb-6">
                                <Textarea
                                    name="contents"
                                    label="본문"
                                    rows="20"
                                    control={control}
                                    placeholder="본문을 입력하세요."
                                    resize={true}
                                />
                                {/*       <FormTextarea
                                    value={formData.contents}
                                    onChange={(val) => handleFormChange(val, "contents")}
                                    name="contents"
                                    placeholder="본문을 입력하세요."
                                    rows="20"
                                    label="본문"
                                />*/}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <FormInput
                            value={formData.writerDepartment}
                            onChange={(val) => handleFormChange(val, "writerDepartment")}
                            name="writerDepartment"
                            placeholder="작성자 부서명"
                            label="작성자 부서명"
                        />
                        <FormDatepicker
                            value={formData.writeDt}
                            onChange={(val) => handleFormChange(val, "writeDt")}
                            name="writeDt"
                            label="작성일자"
                            placeholderText="작성일자 선택"
                        />
                    </div>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <FormInput
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
                        />
                    </div>
                    <hr className="my-10"/>

                    {/* 이미지 업로드 */}
                    <div className="mb-6">
                        <FormFile
                            value={formData.pcKeyImageFileList}
                            onChange={(val) => handleFormChange(val, "pcKeyImageFileList")}
                            label="PC 목록 썸네일 이미지"
                        />
                    </div>
                    <div className="mb-6">
                        <FormFile
                            value={formData.moKeyImageFileList}
                            onChange={(val) => handleFormChange(val, "moKeyImageFileList")}
                            label="MO 목록 썸네일 이미지"
                        />
                    </div>
                    <div className="mb-6">
                        <FormFile
                            value={formData.pcDetailKeyImageFileList}
                            onChange={(val) =>
                                handleFormChange(val, "pcDetailKeyImageFileList")
                            }
                            label="PC 본문 이미지"
                        />
                    </div>
                    <div className="mb-6">
                        <FormFile
                            value={formData.moDetailKeyImageFileList}
                            onChange={(val) =>
                                handleFormChange(val, "moDetailKeyImageFileList")
                            }
                            label="MO 본문 이미지"
                        />
                    </div>
                    <div className="mb-6">
                        <FormFile
                            value={formData.pcWriterImageFileList}
                            onChange={(val) => handleFormChange(val, "pcWriterImageFileList")}
                            label="PC 작성자 이미지"
                        />
                    </div>
                    <div className="mb-6">
                        <FormFile
                            value={formData.moWriterImageFileList}
                            onChange={(val) => handleFormChange(val, "moWriterImageFileList")}
                            label="MO 작성자 이미지"
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
