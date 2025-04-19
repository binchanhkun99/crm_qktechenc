export default [
  // { heading: 'Người dùng' },
  // {
  //   title: 'Người dùng',
  //   icon: { icon: 'bx-user' },
  //   children: [
  //     { title: 'Danh sách', to: 'apps-user-list' },
  //     // { title: 'View', to: { name: 'apps-user-view-id', params: { id: 21 } } },
  //   ],
  // },
  { heading: 'Hệ thống' },
  {
    title: 'Logo công ty',
    icon: { icon: 'bx-file' },
    children: [
      { title: 'Sửa Logo', to: 'apps-logo' },
      // { title: 'Banner', to: { name: 'apps-banner'} },
    ],
  },
  {
    title: 'Cấu hình',
    icon: { icon: 'bx-paint' },
    children: [
      { title: 'Event', to: 'apps-gptvsdfs' },
    ],
  },
  {
    title: 'Thông tin liên hệ',
    icon: { icon: 'bxs-contact' },
    children: [
      { title: 'Chỉnh sửa', to: 'apps-prompt-list' },
    ],
  },
  {
    title: 'Phân Tích Dữ Liệu',
    icon: { icon: 'bxs-layer' },
    children: [
      { title: 'Phân tích', to: 'apps-prompt-chude' },
    ],
  },

]
