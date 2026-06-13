import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Essentials/layout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { ToastProvider } from "./components/ui/toast";
import AiChatAssistant from "./dashboard/ai";
import DashboardCards from "./dashboard/dashboardPage";
import EconomicPage from "./dashboard/economic";
import HistoryPage from "./dashboard/history";
import ProfilePage from "./dashboard/profile";
import SettingsPage from "./dashboard/settings";
import UploadPage from "./dashboard/upload";
import VoicePage from "./dashboard/voice";
import FormPage from "./components/Login/login";

export default function App() {
	return (
		<BrowserRouter>
			<ToastProvider>
				<Layout>
					<Routes>
						<Route path="/" element={<FormPage />} />
						{/* Default redirect: when user opens /dashboard, go to /dashboard/dashboardPage */}
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<Navigate to="/dashboard/dashboardPage" replace />
								</ProtectedRoute>
							}
						/>

						<Route path="/dashboard/dashboardPage" element={<ProtectedRoute><DashboardCards /></ProtectedRoute>} />
						<Route path="/dashboard/economic" element={<ProtectedRoute><EconomicPage /></ProtectedRoute>} />
						<Route path="/dashboard/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
						<Route path="/admin/requests" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
						<Route path="/admin/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
						<Route path="/dashboard/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
						<Route path="/dashboard/voice" element={<ProtectedRoute><VoicePage /></ProtectedRoute>} />
						<Route path="/dashboard/ai" element={<ProtectedRoute><AiChatAssistant /></ProtectedRoute>} />
					</Routes>
				</Layout>
			</ToastProvider>
		</BrowserRouter>
	);
}
