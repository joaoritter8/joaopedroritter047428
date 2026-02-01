import { Routes, Route, Navigate } from 'react-router-dom'
import { TutoresListPage } from './pages/tutores-list-page'
import { TutorDetailPage } from './pages/tutor-detail-page'
import { TutorFormPage } from './pages/tutor-form-page'

export function TutoresModuleRoutes() {
  return (
    <Routes>
      <Route index element={<TutoresListPage />} />
      <Route path="novo" element={<TutorFormPage />} />
      <Route path=":id" element={<TutorDetailPage />} />
      <Route path=":id/editar" element={<TutorFormPage />} />
      <Route path="*" element={<Navigate to="/tutores" replace />} />
    </Routes>
  )
}
