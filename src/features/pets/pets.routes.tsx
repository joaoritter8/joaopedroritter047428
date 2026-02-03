import { Routes, Route, Navigate } from 'react-router-dom';
import { PetsListPage } from './pages/pets-list-page';
import { PetDetailPage } from './pages/pet-detail-page';
import { PetFormPage } from './pages/pet-form-page';

export function PetsIndexRoute() {
  return <PetsListPage />;
}

export function PetsModuleRoutes() {
  return (
    <Routes>
      <Route path="novo" element={<PetFormPage />} />
      <Route path=":id" element={<PetDetailPage />} />
      <Route path=":id/editar" element={<PetFormPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
