import DefaultsLayout from "@/layouts/defaults"
import PaginationItem from "@/components/global/pagination-item"
import PageTitle from "@/components/global/page-title"
import Link from "next/link"
import Button from "@/components/global/button"
import { useState } from "react"
import Loading from "@/components/global/loading"
import { useApiGet } from "@/hook/useAxios"

export default function Magazine() {
  const [currentPage, setCurrentPage] = useState(1)
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }
  const {
    data: magData,
    error,
    isLoading,
  } = useApiGet(`/api/magazine?currentPage=${currentPage}`)

  console.log(error)
  return (
    <>
      <PageTitle title="Magazine 관리" />
      <div
        className="relative shadow-md sm:rounded-lg bg-white min-h-[610px] p-4"
        style={{ width: "100%", minWidth: "1000px" }}
      >
        {isLoading && <Loading />}
        {error && <div>에러 발생: {error.message}</div>}
        {magData && (
          <table
            className="text-sm text-left text-gray-500 dark:text-gray-400"
            style={{ width: "100%" }}
          >
            <thead className="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  className="p-4 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Seq
                </th>
                <th
                  scope="col"
                  className="p-4 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  제목
                </th>
                <th
                  scope="col"
                  className="p-4 text-left text-xs font-medium text-gray-500 uppercase text-left"
                >
                  작성자
                </th>
                <th
                  scope="col"
                  className="p-4 text-left text-xs font-medium text-gray-500 uppercase text-right"
                >
                  등록일
                </th>
                <th
                  scope="col"
                  className="p-4 text-left text-xs font-medium text-gray-500 uppercase text-center"
                >
                  Edit
                </th>
              </tr>
            </thead>
            <tbody>
              {magData.data.list.map((data) => (
                <tr
                  key={data.magazineSeq}
                  className=" border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-blue-800"
                >
                  <th
                    scope="row"
                    className="p-4 text-sm text-base text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {data.magazineSeq}
                  </th>
                  <td
                    className="p-4 text-sm text-base cursor-pointer"
                    style={{ maxWidth: "600px" }}
                  >
                    <Link
                      className="block overflow-ellipsis whitespace-nowrap overflow-hidden underline"
                      href={{
                        pathname: `/magazine/${data.magazineSeq}`,
                      }}
                    >
                      {data.pcTitle}
                    </Link>
                  </td>
                  <td
                    style={{ maxWidth: "240px" }}
                    className="p-4 text-sm text-base overflow-ellipsis whitespace-nowrap overflow-hidden text-left inline-block"
                  >
                    {data.writerName}
                  </td>
                  <td className="p-4 text-sm text-base overflow-ellipsis whitespace-nowrap text-right">
                    {data.registrationDt}
                  </td>
                  <td className="p-4 text-sm text-base overflow-ellipsis whitespace-nowrap text-gray-500 underline text-center">
                    <Link
                      href={{
                        pathname: `/magazine/${data.magazineSeq}`,
                      }}
                    >
                      <span>수정하기</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-end mt-6 space-x-2">
        <Link href="/magazine/list">
          <Button name="정렬 순서 수정" size="md" color="black" />
        </Link>
        <Link href="/magazine/write">
          <Button name="글 쓰기" size="md" color="primary" />
        </Link>
      </div>
      <PaginationItem
        currentPage={currentPage}
        totalCount={`${magData ? magData.data.totalCount : "50"}`}
        onPageChange={handlePageChange}
      />
    </>
  )
}

Magazine.layout = DefaultsLayout
