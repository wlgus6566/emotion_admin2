import DefaultsLayout from "@/layouts/defaults"
import PageTitle from "@/components/global/page-title"
import FormInput from "@/components/global/form-input"
import FormTextarea from "@/components/global/form-textarea"
import FormDatepicker from "@/components/global/form-datepicker"
import FormFile from "@/components/global/form-file"
import Button from "@/components/global/button"
import FormCheckboxGroup from "@/components/global/form-checkbox-group"
import { useState } from "react"
import { faMinus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import FormSelect from "@/components/global/form-select"
import axios from "axios"
import Cookies from "js-cookie"

export default function WorksWrite() {
  const projectTypeOptions = [
    {
      value: "PJT_WEARABLE",
      label: "웨어러블",
    },
    {
      value: "PJT_MOBILE_APP",
      label: "모바일 앱",
    },
    {
      value: "PJT_MOBILE_WEB",
      label: "모바일 웹",
    },
    {
      value: "PJT_PC_WEB",
      label: "PC 웹",
    },
    {
      value: "PJT_MAINTENANCE",
      label: "유지/운영",
    },
    {
      value: "PJT_RENEWAL",
      label: "리뉴얼",
    },
    {
      value: "PJT_CONSTRUCTION",
      label: "신규구축",
    },
    {
      value: "PJT_CONSULTING",
      label: "컨설팅",
    },
    {
      value: "PJT_OTHERS",
      label: "기타",
    },
  ]
  const fieldTypeOptions = [
    { label: "디자인", value: "FDT_DESIGN" },
    { label: "프로젝트 상세", value: "FDT_PROJECT_DESC" },
    { label: "프로젝트 GOAL", value: "FDT_PROJECT_GOAL" },
    { label: "프로젝트 INFO", value: "FDT_PROJECT_INFO" },
  ]
  const [formData, setFormData] = useState({
    clientName: "클라이언트명", //클라이언트명
    launchingDt: "",
    projectName: "프로젝트 타이틀입니다", //프로젝트 타이틀
    projectTypeCodeList: [],
    serviceName: "프로젝트명", //프로젝트명
    listFontColor: "",
    detailFontColor: "",
    sortingOrder: 1,
    keyVisualBigImageFile: {
      pcFileList: [{}],
      moFileList: [{}],
      keyVisualType: "KVT_DETAIL",
    },
    keyVisualSmallImageFile: {
      pcFileList: [{}],
      moFileList: [{}],
      keyVisualType: "KVT_DETAIL",
    },
    keyVisualDetailImageFile: {
      pcFileList: [{}],
      moFileList: [{}],
      keyVisualType: "KVT_DETAIL",
    },
    awardList: [
      {
        awardPrize: "어워드리스트1",
        awardSeq: 11,
      },
      {
        awardPrize: "어워드리스트2",
        awardSeq: 11,
      },
    ],
    fieldList: [
      {
        backgroundColor: "",
        contents: "컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠컨텐츠",
        fieldTypeCode: "",
        fontColor: "",
        titleOne: "타이틀1",
        titleTwo: "타이틀2",
        youtubeUrl: "https://www.youtube.com/",
        fieldImageFile: {
          pcFileList: [{}],
          moFileList: [{}],
        },
      },
    ],
    interview: {
      pcFileList: [{}],
      moFileList: [{}],
      contents: "인터뷰내용",
    },
    creditList: [
      {
        nameList: "정원",
        position: "PM",
      },
      {
        nameList: "지현,지원,지영",
        position: "PUBLISH",
      },
      {
        nameList: "서현,서원,서진",
        position: "DESIGN",
      },
    ],
  })
  const changeCreditList = () => {
    const creditList = formData["creditList"]
    const creditList2 = creditList.map((credit) => {
      const nameList = credit.nameList.split(",")
      return {
        nameList: nameList,
        position: credit.position,
      }
    })
    formData["creditList"] = creditList2
  }
  const onAddOrDelete = (keyName, index) => {
    if (index) {
      //delete
      const findIndex = formData[keyName].findIndex((el, idx) => idx === index)
      let arr = [...formData[keyName]]
      arr.splice(findIndex, 1)
      const newFormData = { ...formData, [keyName]: arr }
      setFormData(newFormData)
    } else {
      //add
      let arr = [...formData[keyName]]
      switch (keyName) {
        case "awardList":
          arr.push({
            awardPrize: "",
            awardSeq: 11,
          })
          break
        case "fieldList":
          arr.push({
            backgroundColor: "",
            contents: "",
            fieldTypeCode: "",
            fontColor: "",
            titleOne: "",
            titleTwo: "",
            youtubeUrl: "",
          })
          break
        case "creditList":
          arr.push({
            nameList: "",
            position: "",
          })
          break
        default:
          alert(keyName, "어떤 값인지 파악이 되지 않습니다.")
      }
      setFormData({ ...formData, [keyName]: arr })
    }
  }

  const handleFormChange = (val, depth1, depth2) => {
    if (depth2) {
      setFormData({
        ...formData,
        [depth1]: { ...formData[depth1], [depth2]: val },
      })
      return
    }
    setFormData({ ...formData, [depth1]: val })
  }

  const handleArrayChange = (val, depth1, depth2, index, depth3) => {
    const form = formData[depth1]
    if (depth3) {
      ;[...form][index][depth2] = {
        ...form[index][depth2],
        [depth3]: val,
      }
      setFormData({ ...formData })
      return
    }
    ;[...form][index][depth2] = val
    setFormData({ ...formData })
  }
  const filesUpload = async (files) => {
    try {
      const fileArr = files
      const form = new FormData()
      console.log(fileArr)
      fileArr.forEach((file) => {
        form.append("files", file)
      })
      const response = await axios.post(
        `${process.env.BASE_URL}/api/file/uploads`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${Cookies.get("accessToken")}`,
          },
        }
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

        return arr

        //setFormData({ ...formData, [name]: arr })
      } else {
        throw response
      }
    } catch (e) {
      console.log("filesUploadError", e)
      return false
    }
  }
  const handleSubmit = async (event) => {
    try {
      event.preventDefault()
      changeCreditList()
      const keyVisualFiles = [
        "keyVisualBigImageFile",
        "keyVisualDetailImageFile",
        "keyVisualSmallImageFile",
      ]
      for (const file of keyVisualFiles) {
        for (const type of ["pcFileList", "moFileList"]) {
          formData[file][type] = await filesUpload(formData[file][type])
        }
      }
      formData.interview.pcFileList = await filesUpload(
        formData.interview.pcFileList
      )
      formData.interview.moFileList = await filesUpload(
        formData.interview.moFileList
      )

      await Promise.all(
        formData.fieldList.map(async (field) => {
          field.fieldImageFile.pcFileList = await filesUpload(
            field.fieldImageFile.pcFileList
          )
          field.fieldImageFile.moFileList = await filesUpload(
            field.fieldImageFile.moFileList
          )
        })
      )

      event.preventDefault()
      console.log(formData)
      await formSubmit()
    } catch (error) {
      console.log(error)
    }
  }
  const formSubmit = async () => {
    try {
      const res = await axios.post(
        `${process.env.BASE_URL}/api/works`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${Cookies.get("accessToken")}`,
          },
        }
      )
      console.log(res)
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <div>
      <PageTitle title="Works 관리" />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-10 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h4 className="text-lg font-semibold">기본정보</h4>
            <div className="border-y-2 border-y-black p-4 my-4">
              <div className="grid gap-6 mb-6 grid-cols-[3fr,1fr]">
                <FormInput
                  value={formData.projectName}
                  name="projectName"
                  onChange={(val) => handleFormChange(val, "projectName")}
                  placeholder="프로젝트 타이틀"
                  label="프로젝트 타이틀"
                  required={false}
                />
                <FormDatepicker
                  value={formData.launchingDt}
                  onChange={(val) => handleFormChange(val, "launchingDt")}
                  name="launchingDt"
                  label="릴리즈일자"
                  placeholderText="릴리즈일자 선택"
                />
              </div>
              <div className="grid gap-6 mb-6 grid-cols-2">
                <FormInput
                  value={formData.serviceName}
                  onChange={(val) => handleFormChange(val, "serviceName")}
                  name="serviceName"
                  placeholder="프로젝트명"
                  label="프로젝트명"
                  required={false}
                />
                <FormInput
                  value={formData.clientName}
                  onChange={(val) => handleFormChange(val, "clientName")}
                  name="clientName"
                  placeholder="클라이언트명"
                  label="클라이언트명"
                  required={false}
                />
              </div>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <FormInput
                  value={formData.listFontColor}
                  onChange={(val) => handleFormChange(val, "listFontColor")}
                  name="listFontColor"
                  type="color"
                  placeholder="목록폰트색상"
                  label="목록폰트색상"
                  required={false}
                />
                <FormInput
                  value={formData.detailFontColor}
                  onChange={(val) => handleFormChange(val, "detailFontColor")}
                  name="detailFontColor"
                  type="color"
                  placeholder="상세폰트색상"
                  label="상세폰트색상"
                  required={false}
                />
              </div>

              <div className="mb-6">
                <FormCheckboxGroup
                  checkboxes={projectTypeOptions}
                  label="프로젝트 타입"
                  value={formData.projectTypeCodeList}
                  onChange={(val) =>
                    handleFormChange(val, "projectTypeCodeList")
                  }
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <FormFile
              value={formData.keyVisualBigImageFile.pcFileList}
              onChange={(val) =>
                handleFormChange(val, "keyVisualBigImageFile", "pcFileList")
              }
              multiple={false}
              label="KV PC BIG 이미지"
              required={false}
            />
          </div>
          <div className="mt-6">
            <FormFile
              value={formData.keyVisualBigImageFile.moFileList}
              onChange={(val) =>
                handleFormChange(val, "keyVisualBigImageFile", "moFileList")
              }
              multiple={false}
              label="KV MO BIG 이미지"
              required={false}
            />
          </div>
          <div className="mt-6">
            <FormFile
              value={formData.keyVisualSmallImageFile.pcFileList}
              onChange={(val) =>
                handleFormChange(val, "keyVisualSmallImageFile", "pcFileList")
              }
              multiple={false}
              label="KV PC SMALL 이미지"
              required={false}
            />
          </div>
          <div className="mt-6">
            <FormFile
              value={formData.keyVisualSmallImageFile.moFileList}
              onChange={(val) =>
                handleFormChange(val, "keyVisualSmallImageFile", "moFileList")
              }
              multiple={false}
              label="KV MO SMALL 이미지"
              required={false}
            />
          </div>
          <div className="mt-6">
            <FormFile
              value={formData.keyVisualDetailImageFile.pcFileList}
              onChange={(val) =>
                handleFormChange(val, "keyVisualDetailImageFile", "pcFileList")
              }
              multiple={false}
              label="KV PC DETAIL 이미지"
              required={false}
            />
          </div>
          <div className="mt-6">
            <FormFile
              value={formData.keyVisualDetailImageFile.moFileList}
              onChange={(val) =>
                handleFormChange(val, "keyVisualDetailImageFile", "moFileList")
              }
              multiple={false}
              label="KV MO DETAIL 이미지"
              required={false}
            />
          </div>
          <div className="my-20">
            <h4 className="text-lg font-semibold">어워드</h4>
            <div className="border-y-2 border-y-black p-4 my-4">
              {formData.awardList &&
                formData.awardList.map((item, index) => (
                  <div
                    key={index}
                    className="grid gap-6 mb-6 grid-cols-[10fr,1fr]"
                  >
                    <FormInput
                      name="awardPrize"
                      value={item.awardPrize}
                      required={false}
                      onChange={(value) =>
                        handleArrayChange(
                          value,
                          "awardList",
                          "awardPrize",
                          index
                        )
                      }
                      placeholder="어워드 상세"
                      label={`${index === 0 ? "어워드 리스트" : ""}`}
                    />
                    {index !== 0 && (
                      <button
                        className="border rounded-full w-8 h-8"
                        onClick={() => onAddOrDelete("awardList", index)}
                        type="button"
                      >
                        <FontAwesomeIcon icon={faMinus} className="" />
                      </button>
                    )}
                  </div>
                ))}
              <div className="flex items-end w-50 h-50 mb-3">
                <div>
                  <Button
                    onClick={() => onAddOrDelete("awardList")}
                    type="button"
                    size="sm"
                    name="추가"
                    color="primary"
                  />
                </div>
                <button
                  className=""
                  onClick={() => onAddAwardDiv()}
                  type="button"
                ></button>
              </div>
            </div>
          </div>

          {/*-----프로젝트 상세-----*/}

          <div className="my-20 py-4">
            <h4 className="text-lg font-semibold">프로젝트 상세</h4>

            {formData.fieldList &&
              formData.fieldList.map((item, index) => (
                <div key={index} className="p-4 my-4 border-t-2 border-t-black">
                  {index >= 1 && (
                    <div className="flex justify-end">
                      <Button
                        onClick={() => onAddOrDelete("fieldList", index)}
                        type="button"
                        size="sm"
                        name="삭제"
                        color="primary"
                      />
                    </div>
                  )}
                  <div className="mt-6">
                    <FormSelect
                      name="fieldTypeCode"
                      value={item.fieldTypeCode}
                      required={false}
                      onChange={(value) =>
                        handleArrayChange(
                          value,
                          "fieldList",
                          "fieldTypeCode",
                          index
                        )
                      }
                      options={fieldTypeOptions}
                      label="타입 코드"
                    />
                  </div>
                  <div className="grid gap-6 mb-6 grid-cols-2 mt-6">
                    <FormInput
                      name="titleOne"
                      value={item.titleOne}
                      required={false}
                      onChange={(value) =>
                        handleArrayChange(value, "fieldList", "titleOne", index)
                      }
                      placeholder="타이틀1"
                      label="타이틀1"
                    />
                    <FormInput
                      name="titleTwo"
                      value={item.titleTwo}
                      required={false}
                      onChange={(value) =>
                        handleArrayChange(value, "fieldList", "titleTwo", index)
                      }
                      placeholder="타이틀2"
                      label="타이틀2"
                    />
                  </div>
                  <div className="mt-6">
                    <FormTextarea
                      name="contents"
                      value={item.contents}
                      required={false}
                      onChange={(value) =>
                        handleArrayChange(value, "fieldList", "contents", index)
                      }
                      placeholder="본문을 입력하세요."
                      label="본문"
                    />
                  </div>
                  <div className="grid gap-6 mt-6 md:grid-cols-2">
                    <FormInput
                      name="fontColor"
                      value={item.fontColor}
                      required={false}
                      type="color"
                      onChange={(value) =>
                        handleArrayChange(
                          value,
                          "fieldList",
                          "fontColor",
                          index
                        )
                      }
                      placeholder="폰트색상"
                      label="폰트색상"
                    />
                    <FormInput
                      name="backgroundColor"
                      value={item.backgroundColor}
                      required={false}
                      type="color"
                      onChange={(value) =>
                        handleArrayChange(
                          value,
                          "fieldList",
                          "backgroundColor",
                          index
                        )
                      }
                      placeholder="배경색상"
                      label="배경색상"
                    />
                  </div>
                  <div className="mt-6">
                    <FormInput
                      name="youtubeUrl"
                      value={item.youtubeUrl}
                      required={false}
                      onChange={(value) =>
                        handleArrayChange(
                          value,
                          "fieldList",
                          "youtubeUrl",
                          index
                        )
                      }
                      placeholder="유튜브 URL"
                      label="유튜브 URL"
                    />
                  </div>
                  <div className="mt-6">
                    <div className="mt-6">
                      <FormFile
                        value={item.fieldImageFile?.pcFileList}
                        required={false}
                        onChange={(value) =>
                          handleArrayChange(
                            value,
                            "fieldList",
                            "fieldImageFile",
                            index,
                            "pcFileList"
                          )
                        }
                        label="PC 이미지"
                      />
                    </div>
                    <div className="mt-6">
                      <FormFile
                        value={item.fieldImageFile?.moFileList}
                        required={false}
                        onChange={(value) =>
                          handleArrayChange(
                            value,
                            "fieldList",
                            "fieldImageFile",
                            index,
                            "moFileList"
                          )
                        }
                        label="MO 이미지"
                      />
                    </div>
                  </div>
                </div>
              ))}

            <div>
              <Button
                onClick={() => onAddOrDelete("fieldList")}
                type="button"
                size="sm"
                name="추가"
                color="primary"
              />
            </div>
          </div>
          {/*//----프로젝트 상세----*/}

          {/*-----인터뷰-----*/}
          <div className="my-20">
            <h4 className="text-lg font-semibold">인터뷰</h4>
            <div className="border-y-2 border-y-black p-4 my-4">
              <div className="mt-6">
                <FormTextarea
                  name="contents"
                  value={formData.interview.contents}
                  required={false}
                  onChange={(val) =>
                    handleFormChange(val, "interview", "contents")
                  }
                  placeholder="내용"
                  label="내용"
                />
              </div>
              <div className="mt-6">
                <FormFile
                  value={formData.interview.pcFileList}
                  required={false}
                  onChange={(val) =>
                    handleFormChange(val, "interview", "pcFileList")
                  }
                  label="PC 이미지"
                />
              </div>
              <div className="mt-6">
                <FormFile
                  value={formData.interview.moFileList}
                  required={false}
                  onChange={(val) =>
                    handleFormChange(val, "interview", "moFileList")
                  }
                  label="MO 이미지"
                />
              </div>
            </div>
          </div>
          {/*//-----인터뷰-----*/}

          <div className="my-20">
            <h4 className="text-lg font-semibold">투입인원</h4>
            <div className="border-y-2 border-y-black p-4 my-4">
              {formData.creditList &&
                formData.creditList.map((item, index) => (
                  <div
                    key={index}
                    className="grid gap-6 mb-6 grid-cols-[10fr,10fr,1fr]"
                  >
                    <FormInput
                      name="position"
                      value={item.position}
                      onChange={(val) =>
                        handleArrayChange(val, "creditList", "position", index)
                      }
                      placeholder="포지션"
                      label="포지션"
                      required={false}
                    />
                    <FormInput
                      name="name"
                      value={item.nameList}
                      onChange={(val) =>
                        handleArrayChange(val, "creditList", "nameList", index)
                      }
                      placeholder="이모션1,이모션2,이모션3"
                      label="이름"
                      desc="콤마로 구분하여 입력해주세요."
                      required={false}
                    />
                    {index !== 0 && (
                      <button
                        className="border rounded-full w-8 h-8 mt-8"
                        onClick={() => onAddOrDelete("creditList", index)}
                        type="button"
                      >
                        <FontAwesomeIcon icon={faMinus} className="" />
                      </button>
                    )}
                  </div>
                ))}
              <div>
                <Button
                  onClick={() => onAddOrDelete("creditList")}
                  type="button"
                  size="sm"
                  name="추가"
                  color="primary"
                />
              </div>
            </div>
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

WorksWrite.layout = DefaultsLayout
