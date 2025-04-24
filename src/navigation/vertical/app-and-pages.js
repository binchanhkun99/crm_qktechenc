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
    title: 'Quản lý Logo',
    icon: { icon: 'bx-file' },
    children: [
      { title: 'Sửa logo', to: 'apps-logo' },
      // { title: 'Banner', to: { name: 'apps-banner'} },
    ],
  },
  {
    title: 'Quản lí bài viết',
    icon: { icon: 'bx-paint' },
    children: [
      { title: 'Chỉnh sửa bài viết', to: 'apps-article' },
    ],
  },
  {
    title: 'Quản lí tin tức',
    icon: { icon: 'bxs-contact' },
    children: [
      { title: 'Chỉnh sửa tin tức', to: 'apps-news' },
    ],
  },
  {
    title: 'Quản lí feedback',
    icon: { icon: 'bxs-layer' },
    children: [
      { title: 'Chỉnh sửa feedback', to: 'apps-feedback' },
    ],
  },
]
