export const adminMenu = [
    {
        //Quản lý người dùng
        name: 'menu.admin.manage-user',
        menus: [
          {
            name: 'menu.admin.crud-redux',
            link: '/system/manage-user',
          },
          {
            name: 'menu.admin.manage-doctor',
            link: '/system/manage-doctor',
          },
        ],
      },
      {
        //Quản lý phòng khám
        name: 'menu.admin.clinic',
        menus: [
          {
            name: 'menu.admin.manage-clinic',
            link: '/system/manage-clinic',
          },
        ],
      },
      {
        //Quản lý chuyên khoa
        name: 'menu.admin.specialty',
        menus: [
          {
            name: 'menu.admin.manage-specialty',
            link: '/system/manage-specialty',
          },
        ],
      },

];

export const doctorMenu = [
  {
    name: 'menu.admin.manage-user',
    menus: [
      {
        //Quản lý kế hoạch khám bệnh của bác sĩ
        name: 'menu.doctor.manage-schedule',
        link: '/doctor/manage-schedule',
      },
      {
        //Quản lý benh nhan khám bệnh của bác sĩ
        name: 'menu.doctor.manage-patient',
        link: '/doctor/manage-patient',
      },
      {
        //Quản lý benh nhan đã hoàn thành khám
        name: 'menu.doctor.manage-patient-success',
        link: '/doctor/manage-patient-success',
      },
    ],
  },
];
