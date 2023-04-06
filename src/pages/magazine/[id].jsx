import DefaultsLayout from "@/layouts/defaults"
import PageTitle from "@/components/global/page-title"
import FormInput from "@/components/global/form-input"
import FormTextarea from "@/components/global/form-textarea"
import FormFile from "@/components/global/form-file"
import FormDatepicker from "@/components/global/form-datepicker"
import Button from "@/components/global/button"
import {useEffect, useState} from "react"
import Router, {useRouter} from "next/router"
import {useApiDelete, useApiGet, useApiPost, useApiPut} from "@/hook/useAxios"
import Loading from "@/components/global/loading"
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import Input from "@/components/global/Input";
import Textarea from "@/components/global/Textarea";
import File from "@/components/global/File";
import Datepicker from "@/components/global/Datepicker";

export default function MagazineDetail() {
    const router = useRouter()
    const id = router?.query?.id
    const [formData, setFormData] = useState({})
    const [fileData, setFileData] = useState({})

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
        formState
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
    })

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

    const handleFormChange = (val, name) => {
        setFormData({...formData, [name]: val})
    }
    const handleFileChange = (val, name) => {
        setFileData({...fileData, [name]: val})
    }
    const filesUpload = async (name) => {
        try {
            const fileArr = fileData[name]
            const form = new FormData()
            formData[name].map((file) => {
                file.delYn = true
            })
            console.log(fileArr)
            console.log(form)
            fileArr.forEach((el) => {
                form.append("files", el)
            })
            console.log(form)
            const response = await useApiPost(`/api/file/uploads`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            if (response.data.code === "SUC001") {
                console.log("성공")
                const arr = await response.data.data.map((el) => {
                    return {
                        fileName: el.fileName,
                        filePath: el.filePath,
                        fileExtensionName: el.fileExtensionName,
                    }
                })
                console.log(arr)
                fileData[name] = arr
                console.log(fileData[name])
                formData[name] = [...formData[name], ...fileData[name]]
                //setFileData({ ...fileData, [name]: arr })
                console.log(fileData)
                if (name === "contentsImageFileList") {
                    handleContentsImgSrcChange(arr)
                }
            } else {
                throw response
            }
        } catch (e) {
            console.log("filesUploadError", e)
            return false
        }
    }

    const handleDelete = async () => {
        try {
            if (!confirm("게시물을 삭제하시겠습니까?")) {
                return
            }
            const res = await useApiDelete(`/api/magazine/${id}`)
            if (res.data.code === "SUC001") {
                console.log(res)
                await alert("게시물이 삭제되었습니다.")
                await Router.push("/magazine", undefined, {shallow: true})
            } else {
                throw res
            }
        } catch (e) {
            console.log(e)
        }
    }
    const handleSubmitForm = async (event) => {
        try {
            let keys = []
            for (let key in fileData) {
                if (formData.hasOwnProperty(key)) {
                    keys.push(key)
                }
            }
            await Promise.all(
                keys.map(async (key) => {
                    await filesUpload(key)
                })
            )
            await formSubmit()
            //Router.push('/magazine',undefined,{ shallow: true })
        } catch (error) {
            console.error(error)
        }
    }
    const formSubmit = async () => {
        try {
            console.log("formData", formData)
            const res = await useApiPut(`/api/magazine`, formData)
            console.log(res)
        } catch (e) {
            console.log(e)
        }
    }

    const {data, error} = useApiGet(id ? `/api/magazine/${id}` : null)
    useEffect(() => {
        if (error) {
            console.log("Failed to load user data")
        }
    }, [error])

    useEffect(() => {
        if (data?.code === "SUC001") {
            console.log(data)
            const date = new Date(data.data.writeDt);

            Object.entries(data.data).forEach(
                ([name, value]) => setValue(name, value));
            setValue('writeDt', date);
        }
    }, [data])

    return (
        <div>
            <PageTitle title="Magazine 수정"/>
            <div className="relative overflow-x-auto min-h-[610px]  shadow-md sm:rounded-lg p-10 bg-white">
                {/*{!formData.pcTitle && <Loading/>}*/}
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
                                {/*   <File
                                    name="contentsImageFileList"
                                    label="본문 첨가이미지"
                                    required={true}
                                    multiple={true}
                                    control={control}
                                    maxLength={20}
                                />*/}

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
                    </div>
                    <hr className="my-10"/>
                    {/*    <div className="grid gap-6 mb-6 md:grid-cols-2">
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
                    </div>*/}
                    <div className="flex justify-end mt-6 space-x-2">
                        <Button name="수정하기" type="submit" size="md" color="blue"/>
                        <Button
                            name="삭제하기"
                            type="button"
                            size="md"
                            color="primary"
                            onClick={handleDelete}
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

MagazineDetail.layout = DefaultsLayout
