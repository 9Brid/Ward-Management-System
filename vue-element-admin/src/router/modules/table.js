/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: 'Table',
    icon: 'table'
  },
  children: [
    {
      path: 'patient-table',
      component: () => import('@/views/table/patient-table'),
      name: 'PatientTable',
      meta: { title: '病人信息表' }
    },
    {
      path: 'doctor-table',
      component: () => import('@/views/table/doctor-table'),
      name: 'DoctorTable',
      meta: { title: '医生信息表' }
    },
    {
      path: 'nurse-table',
      component: () => import('@/views/table/nurse-table'),
      name: 'NurseTable',
      meta: { title: '护士信息表' }
    },
    {
      path: 'department-table',
      component: () => import('@/views/table/department-table'),
      name: 'DepartmentTable',
      meta: { title: '科室信息表' }
    },
    {
      path: 'ward-table',
      component: () => import('@/views/table/ward-table'),
      name: 'WardTable',
      meta: { title: '病房信息表' }
    }
  ]
}
export default tableRouter
