import DefaultsLayout from "@/layouts/defaults"
import PaginationItem from "@/components/global/pagination-item"
import PageTitle from "@/components/global/page-title"
import Link from "next/link"
import { useState } from "react"
import Button from "@/components/global/button"
import Loading from "@/components/global/loading"
import { useApiGet } from "@/hook/useAxios"

export default function Works() {
  const [currentPage, setCurrentPage] = useState(1)
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }
  const dateFormat = (str) => {
    return str.substring(0, 10)
  }
  const { data, error } = useApiGet(`/api/works?currentPage=${currentPage}`)
  return (
    <>
      <PageTitle title="Works 관리" />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white min-h-[610px] p-4">
        {!data && <Loading />}
        {error && <div>에러 발생: {error.message}</div>}
        {data && (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
                  className="p-4 w-5/12 text-center text-xs font-medium text-gray-500 uppercase"
                >
                  서비스명
                </th>
                <th
                  scope="col"
                  className="p-4 w-3/12 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  클라이언트명
                </th>
                <th
                  scope="col"
                  className="p-4 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  등록일
                </th>
                <th
                  scope="col"
                  className="p-4 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Edit
                </th>
              </tr>
            </thead>
            <tbody>
              {data.data.list.map((data) => (
                <tr
                  key={data.worksSeq}
                  className="border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-blue-800"
                >
                  <th
                    scope="row"
                    className="p-4 text-sm text-base text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {data.worksSeq}
                  </th>
                  <td className="p-4 text-sm text-base text-center">
                    <Link
                      href={{
                        pathname: `/works/${data.worksSeq}`,
                      }}
                    >
                      <span className="underline ">{data.serviceName}</span>
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-base">{data.clientName}</td>
                  <td className="p-4 text-sm text-base">
                    {dateFormat(data.registrationDt)}
                  </td>
                  <td className="p-4 text-sm text-base text-gray-500 underline">
                    <Link
                      href={{
                        pathname: `/works/${data.worksSeq}`,
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
        <Link href="/works/list">
          <Button name="정렬 순서 수정" size="md" color="black" />
        </Link>
        <Link href="/works/write">
          <Button name="글 쓰기" size="md" color="primary" />
        </Link>
      </div>
      <PaginationItem
        currentPage={currentPage}
        totalCount={`${data ? data.data.totalCount : "50"}`}
        onPageChange={handlePageChange}
      />
    </>
  )
}

Works.layout = DefaultsLayout
