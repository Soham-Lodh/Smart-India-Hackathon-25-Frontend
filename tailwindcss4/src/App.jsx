import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Essentials/layout";
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
			<Layout>
				<Routes>
					<Route path="/" element={<FormPage />} />
					{/* Default redirect: when user opens /dashboard, go to /dashboard/dashboardPage */}
					<Route
						path="/dashboard"
						element={<Navigate to="/dashboard/dashboardPage" replace />}
					/>

					<Route path="/dashboard/dashboardPage" element={<DashboardCards />} />
					<Route path="/dashboard/economic" element={<EconomicPage />} />
					<Route path="/dashboard/history" element={<HistoryPage />} />
					<Route path="/admin/requests" element={<ProfilePage />} />
					<Route path="/admin/settings" element={<SettingsPage />} />
					<Route path="/dashboard/upload" element={<UploadPage />} />
					<Route path="/dashboard/voice" element={<VoicePage />} />
					<Route path="/dashboard/ai" element={<AiChatAssistant />} />
				</Routes>
			</Layout>
		</BrowserRouter>
	);
}
