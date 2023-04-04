import DefaultsLayout from "@/layouts/defaults"
import PageTitle from "@/components/global/page-title"
import FormInput from "@/components/global/form-input"
import FormTextarea from "@/components/global/form-textarea"
import FormFile from "@/components/global/form-file"
import FormDatepicker from "@/components/global/form-datepicker"
import Button from "@/components/global/button"
import { useEffect, useState } from "react"
import Router, { useRouter } from "next/router"
import { useApiDelete, useApiGet, useApiPost, useApiPut } from "@/hook/useAxios"
import Loading from "@/components/global/loading"

export default function MagazineDetail() {
  const router = useRouter()
  const id = router?.query?.id
  const [formData, setFormData] = useState({})
  const [fileData, setFileData] = useState({})

  const handleContentsImgSrcChange = (arr) => {
    /*
                                                                                                <img :src="require('@/assets/images/mag/img1 - 복사본.jpg')" alt="방 어피니티 다이어그램" />
                                                                                                <div>방 어피니티 다이어그</div>
                                                                                               <br><br>  <img :src="require('@/assets/images/mag/img0.jpg')" alt="다이어그램" />
                                                                                             */
    let contents = formData["contents"] || ""
    arr.forEach((ar) => {
      const { filePath, fileName } = ar
      const pattern = new RegExp(`<img.*?${fileName}.*?\\/>`)
      const match = contents.match(pattern)[0]
      const modifiedTag = match.replace(/:src=".*?"/, `src="${filePath}"`)
      contents = contents.replace(match, modifiedTag)
    })
    formData.contents = contents
    console.log("formData", formData)
  }

  const handleFormChange = (val, name) => {
    setFormData({ ...formData, [name]: val })
  }
  const handleFileChange = (val, name) => {
    setFileData({ ...fileData, [name]: val })
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
        await Router.push("/magazine", undefined, { shallow: true })
      } else {
        throw res
      }
    } catch (e) {
      console.log(e)
    }
  }
  const handleSubmit = async (event) => {
    try {
      event.preventDefault()
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

  const { data, error } = useApiGet(id ? `/api/magazine/${id}` : null)
  useEffect(() => {
    if (error) {
      console.log("Failed to load user data")
    }
  }, [error])

  useEffect(() => {
    if (data?.code === "SUC001") {
      setFormData(data.data)
    }
  }, [data])

  return (
    <div>
      <PageTitle title="Magazine 수정" />
      <div className="relative overflow-x-auto min-h-[610px]  shadow-md sm:rounded-lg p-10 bg-white">
        {!formData.pcTitle && <Loading />}
        {formData.pcTitle && (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <FormInput
                value={formData.pcTitle}
                onChange={(val) => handleFormChange(val, "pcTitle")}
                name="pcTitle"
                placeholder="PC 제목을 입력하세요."
                label="PC 제목"
              />
            </div>
            <div className="mb-6">
              <FormInput
                value={formData.moTitle}
                onChange={(val) => handleFormChange(val, "moTitle")}
                name="moTitle"
                placeholder="MO 제목을 입력하세요."
                label="MO 제목"
              />
            </div>
            <div className="mb-6">
              <FormTextarea
                value={formData.description}
                onChange={(val) => handleFormChange(val, "description")}
                name="description"
                placeholder="설명을 입력하세요."
                label="설명"
              />
            </div>
            <div className="my-20">
              <h4 className="text-lg font-semibold">본문</h4>
              <div className="border-y-2 border-y-black p-4 my-4">
                <div className="mb-6">
                  <FormFile
                    value={
                      fileData.contentsImageFileList
                        ? fileData.contentsImageFileList
                        : formData.contentsImageFileList
                    }
                    onChange={(val) =>
                      handleFileChange(val, "contentsImageFileList")
                    }
                    max="20"
                    multiple={true}
                    label="본문 첨가이미지"
                    modify={true}
                    required={false}
                  />
                </div>
                <div className="mb-6">
                  <FormTextarea
                    value={formData.contents}
                    onChange={(val) => handleFormChange(val, "contents")}
                    name="contents"
                    placeholder="본문을 입력하세요."
                    rows="20"
                    label="본문"
                  />
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
            <hr className="my-10" />

            {/* 이미지 업로드 */}
            <div className="mb-6">
              <FormFile
                value={
                  fileData.pcKeyImageFileList
                    ? fileData.pcKeyImageFileList
                    : formData.pcKeyImageFileList
                }
                onChange={(val) => handleFileChange(val, "pcKeyImageFileList")}
                label="PC 목록 썸네일 이미지"
                required={false}
              />
            </div>
            <div className="mb-6">
              <FormFile
                value={
                  fileData.moKeyImageFileList
                    ? fileData.moKeyImageFileList
                    : formData.moKeyImageFileList
                }
                onChange={(val) => handleFileChange(val, "moKeyImageFileList")}
                label="MO 목록 썸네일 이미지"
                required={false}
              />
            </div>
            <div className="mb-6">
              <FormFile
                value={
                  fileData.pcDetailKeyImageFileList
                    ? fileData.pcDetailKeyImageFileList
                    : formData.pcDetailKeyImageFileList
                }
                onChange={(val) =>
                  handleFileChange(val, "pcDetailKeyImageFileList")
                }
                label="PC 본문 이미지"
                required={false}
              />
            </div>
            <div className="mb-6">
              <FormFile
                value={
                  fileData.moDetailKeyImageFileList
                    ? fileData.moDetailKeyImageFileList
                    : formData.moDetailKeyImageFileList
                }
                onChange={(val) =>
                  handleFileChange(val, "moDetailKeyImageFileList")
                }
                label="MO 본문 이미지"
                required={false}
              />
            </div>
            <div className="mb-6">
              <FormFile
                value={
                  fileData.pcWriterImageFileList
                    ? fileData.pcWriterImageFileList
                    : formData.pcWriterImageFileList
                }
                onChange={(val) =>
                  handleFileChange(val, "pcWriterImageFileList")
                }
                label="PC 작성자 이미지"
                required={false}
              />
            </div>
            <div className="mb-6">
              <FormFile
                value={
                  fileData.moWriterImageFileList
                    ? fileData.moWriterImageFileList
                    : formData.moWriterImageFileList
                }
                onChange={(val) =>
                  handleFileChange(val, "moWriterImageFileList")
                }
                label="MO 작성자 이미지"
                required={false}
              />
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <Button name="수정하기" type="submit" size="md" color="blue" />
              <Button
                name="삭제하기"
                type="button"
                size="md"
                color="primary"
                onClick={handleDelete}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

MagazineDetail.layout = DefaultsLayout
