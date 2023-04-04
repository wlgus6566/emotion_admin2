import axios from "axios"
import DefaultsLayout from "@/layouts/defaults"
import PageTitle from "@/components/global/page-title"
import FormInput from "@/components/global/form-input"
import FormTextarea from "@/components/global/form-textarea"
import FormFile from "@/components/global/form-file"
import FormDatepicker from "@/components/global/form-datepicker"
import Button from "@/components/global/button"
import { useEffect, useState } from "react"
import fetcher from "@/auth/fetcher"
import Router, { useRouter } from "next/router"
import { object } from "prop-types"
import useSWR from "swr"
import Cookies from "js-cookie"
import FormCheckboxGroup from "@/components/global/form-checkbox-group"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus } from "@fortawesome/free-solid-svg-icons"
import FormSelect from "@/components/global/form-select"

export default function WorksDetail() {
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
  const router = useRouter()
  const id = router?.query?.id
  const [formData, setFormData] = useState({
    clientName: "SK텔레콤",
    launchingDt: "2022-03-01",
    projectName: "다양한 신규 서비스로 새로워진",
    projectTypeCodeList: ["PJT_CONSTRUCTION", "PJT_MOBILE_APP"],
    serviceName: "T 다이렉트샵",
    listFontColor: "#fff",
    detailFontColor: "#fff",
    sortingOrder: 1,
    keyVisualBigImageFile: {
      pcFileList: [
        {
          fileName: "image.png",
          fileSize: 77738,
          filePath: "/tmp/a2e6aef2-30a3-4e85-af6e-a164f967a904.jpg",
          fileExtensionName: "image/jpeg",
          delYn: false,
        },
      ],
      moFileList: [
        {
          fileName: "image.png",
          fileSize: 77738,
          filePath: "/tmp/a2e6aef2-30a3-4e85-af6e-a164f967a904.jpg",
          fileExtensionName: "image/jpeg",
          delYn: false,
        },
      ],
      keyVisualType: "KVT_DETAIL",
    },
    keyVisualSmallImageFile: {
      pcFileList: [
        {
          fileName: "image.png",
          fileSize: 77738,
          filePath: "/tmp/a2e6aef2-30a3-4e85-af6e-a164f967a904.jpg",
          fileExtensionName: "image/jpeg",
          delYn: false,
        },
      ],
      moFileList: [
        {
          fileName: "image.png",
          fileSize: 77738,
          filePath: "/tmp/a2e6aef2-30a3-4e85-af6e-a164f967a904.jpg",
          fileExtensionName: "image/jpeg",
          delYn: false,
        },
      ],
      keyVisualType: "KVT_DETAIL",
    },
    keyVisualDetailImageFile: {
      pcFileList: [
        {
          fileName: "WW.png",
          fileSize: 77738,
          filePath: "/tmp/a2e6aef2-30a3-4e85-af6e-a164f967a904.jpg",
          fileExtensionName: "image/jpeg",
          delYn: false,
        },
      ],
      moFileList: [
        {
          fileName: "DFDFDF.png",
          fileSize: 77738,
          filePath: "/tmp/a2e6aef2-30a3-4e85-af6e-a164f967a904.jpg",
          fileExtensionName: "image/jpeg",
          delYn: false,
        },
      ],
      keyVisualType: "KVT_DETAIL",
    },
    awardList: [
      {
        awardPrize: "스마트앱어워드 코리아 2021 브랜드쇼핑몰 분야 대상",
        awardSeq: 11,
      },
    ],
    fieldList: [
      {
        backgroundColor: "#000",
        contents:
          "고객 관점에서 불필요한 단계를 줄이고 온라인에서 손쉽게 <br>가입/개통할",
        fieldTypeCode: "FDT_DESIGN",
        fontColor: "#fff",
        titleOne: "쉽고 빠르게 결제와 할인까지!",
        titleTwo: "쉽고 빠르게 결제와 할인까지!",
        youtubeUrl: "http://www.example.co.kr",
        fieldImageFile: {
          pcFileList: [
            {
              fileName: "image10.png",
              fileSize: 77738,
              filePath: "/tmp/a2e6aef2-30a3-4e85-af6e-a164f967a904.jpg",
              fileExtensionName: "image/jpeg",
              delYn: false,
            },
          ],
          moFileList: [
            {
              fileName: "image.png",
              fileSize: 77738,
              filePath: "/tmp/a2e6aef2-30a3-4e85-af6e-a164f967a904.jpg",
              fileExtensionName: "image/jpeg",
              delYn: false,
            },
          ],
        },
      },
    ],
    interview: {
      pcFileList: [
        {
          fileName: "image.png",
          fileSize: 77738,
          filePath: "/tmp/a2e6aef2-30a3-4e85-af6e-a164f967a904.jpg",
          fileExtensionName: "image/jpeg",
          delYn: false,
        },
      ],
      moFileList: [
        {
          fileName: "image2.png",
          fileSize: 77738,
          filePath: "/tmp/a2e6aef2-30a3-4e85-af6e-a164f967a904.jpg",
          fileExtensionName: "image/jpeg",
          delYn: false,
        },
      ],
      contents:
        "서비스 이용 연령층이 학습을 시작하는 초등 저학년부터 자기 주도적인 학습이 가능한 중등까지 넓은 점을 고려하여 다양한 연령층이 재미있고 효과적인 학습을 할 수 있도록 콘텐츠 기획부터 UI디자인까지 많은 아이디어와 고민을 한 프로젝트였습니다.",
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
  const [fileData, setFileData] = useState({})
  /*  const changeCreditList = () => {
                              const creditList = formData["creditList"]
                              const creditList2 = creditList.map((credit) => {
                                const nameList = credit.nameList.split(",")
                                return {
                                  nameList: nameList,
                                  position: credit.position,
                                }
                              })
                              formData["creditList"] = creditList2
                            }*/
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
      //changeCreditList()
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

  /* use swr */
  /*  const url = process.env.BASE_URL
                            const { data, error } = useApiGet(
                id ? `/api/works/${id}` : null
              )
                            useEffect(() => {
                              if (error) {
                                console.log("Failed to load user data")
                              }
                            }, [error])
                          
                            useEffect(() => {
                              if (data?.code === "SUC001") {
                                setFormData(data.data)
                                const creditList2 = data.data.creditList.map((credit) => {
                                return {
                                  nameList: credit.nameList.split(","),
                                  position: credit.position,
                                };
                                formData['creditList'] = creditList2
                              });
                              }
                            }, [data])
                            console.log(data)*/
  return (
    <div>
      <PageTitle title="Works 수정" />
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
                        color="primary"
                        name="삭제"
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
                      placeholder="이름"
                      label="이름"
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

WorksDetail.layout = DefaultsLayout
