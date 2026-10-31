'use client'

import { useAdminMembers, useDeleteAdminUser } from '@/api/api-hooks/admin/dashboard.api-hooks'
import {
  ConfirmDelete,
  SearchBox,
  TablePagination,
  TableState,
  TABLE_PAGE_SIZE,
  useTableFilters,
} from '@/components/dashboard'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuthStore } from '@/store/auth.store'

const MemberPage = () => {
  const { search, setSearch, page, setPage, deferredSearch } = useTableFilters()
  const { data, isLoading, isError, refetch } = useAdminMembers({
    page,
    page_size: TABLE_PAGE_SIZE,
    search: deferredSearch,
  })
  const { mutateAsync: deleteUser } = useDeleteAdminUser()
  const currentUserEmail = useAuthStore((state) => state.user?.email)
  const members = data?.results ?? []

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <SearchBox value={search} onChange={setSearch} placeholder="Search by name or email" />

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white">
        <Table>
          <TableHeader className="bg-[#f5f4f3]">
            <TableRow className="border-b-0">
              <TableHead className="text-main-button font-medium">Membership ID</TableHead>
              <TableHead className="text-main-button font-medium">Name</TableHead>
              <TableHead className="text-main-button font-medium">Email</TableHead>
              <TableHead className="text-main-button font-medium">Contact Number</TableHead>
              <TableHead className="text-main-button font-medium">Skin Type</TableHead>
              <TableHead className="text-main-button font-medium">Birthday</TableHead>
              <TableHead className="text-main-button text-right font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableState
              colSpan={7}
              isLoading={isLoading}
              isError={isError}
              isEmpty={members.length === 0}
              emptyText={search ? 'No members found matching your search.' : 'No members yet.'}
              onRetry={() => void refetch()}
            />
            {members.map((member) => (
              <TableRow key={member.membership_id} className="border-b border-gray-100">
                <TableCell className="text-main-button">{member.membership_id}</TableCell>
                <TableCell>
                  <span className="text-main-button font-medium">{member.name || '-'}</span>
                </TableCell>
                <TableCell className="text-main-button">{member.email}</TableCell>
                <TableCell className="text-main-button">{member.contact_number || 'N/A'}</TableCell>
                <TableCell className="text-main-button capitalize">
                  {member.skin_type || 'N/A'}
                </TableCell>
                <TableCell className="text-main-button">{member.birth_date || 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    {member.email !== currentUserEmail ? (
                      <ConfirmDelete
                        title={`Delete ${member.name || member.email}?`}
                        description="This permanently deletes the account, including any orders it placed. This can't be undone."
                        onConfirm={() => deleteUser(member.membership_id)}
                      />
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination page={page} count={data?.count ?? 0} onPageChange={setPage} />
    </div>
  )
}

export default MemberPage
