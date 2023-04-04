import DefaultsLayout from "@/layouts/defaults"
import FormFile from "@/components/global/form-file"
import { useState } from "react"
import PageTitle from "@/components/global/page-title"
import { useApiPost, useApiPut } from "@/hook/useAxios"
import Button from "@/components/global/button"

export default function Introduction() {
  const [fileData, setFileData] = useState([])

  const fileUpload = async () => {
    try {
      const fileArr = fileData
      const form = new FormData()
      fileArr.forEach((el) => {
        form.append("file", el)
      })

      const response = await useApiPost(`/api/file/upload`, form)
      console.log(response)
      if (response.data.code === "SUC001") {
        const resFile = response.data.data
        formSubmit(resFile)
      } else {
        throw response
      }
    } catch (e) {
      console.log("filesUploadError", e)
      return false
    }
  }
  const formSubmit = async (file) => {
    try {
      const response = await useApiPut(`/api/companyinfo`, {
        file: {
          fileName: file.fileName,
          fileSize: file.fileSize,
          filePath: file.filePath,
          fileExtensionName: file.fileExtensionName,
          delYn: false,
        },
      })
      if (response.data.code === "SUC001") {
        alert("성공적으로 수정되었습니다.")
      } else {
        throw response
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="min-w-full overflow-hidden">
      <PageTitle title="회사소개서 수정" />
      <form>
        <FormFile
          value={fileData}
          onChange={(val) => setFileData(val)}
          label="회사 소개서 파일"
          required={true}
        />
      </form>
      <div className="flex justify-end mt-6">
        <Button
          name="수정하기"
          type="button"
          size="md"
          color="primary"
          onClick={fileUpload}
        />
      </div>
    </div>
  )
}

Introduction.layout = DefaultsLayout
