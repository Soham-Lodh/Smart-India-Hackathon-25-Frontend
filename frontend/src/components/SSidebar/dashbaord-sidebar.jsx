import {
	Bot,
	Brain,
	CloudUpload,
	Cog,
	House,
	Sprout,
	User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const elements = [
	{
		title: "Dashboard",
		url: "/dashboard/dashboardPage",
		icon: House,
	},
	{
		title: "Upload",
		url: "/dashboard/upload",
		icon: CloudUpload,
	},
	{
		title: "Economic Data ",
		url: "/dashboard/economic",
		icon: Sprout,
	},
	{
		title: "History",
		url: "/dashboard/history",
		icon: User,
	},
	{
		title: "Voice Assistant",
		url: "/dashboard/voice",
		icon: Bot,
	},
	{
		title: "AI Assistant",
		url: "/dashboard/ai",
		icon: Brain,
	},
	{
		title: "Profile",
		url: "/admin/requests",
		icon: User,
	},
	{
		title: "Settings",
		url: "/admin/settings",
		icon: Cog,
	},
];

// const items = [
//   {
//     title: "Web development",
//     url: "#",
//     icon: Code2,
//   },
// ];

export function AdminSidebar() {
	const location = useLocation();
	return (
		<Sidebar className="pt-10 [&>div]:bg-[#fbf9f1] shadow-xl">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel></SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{elements.map((ele) => (
								<SidebarMenuItem key={ele.title}>
									<SidebarMenuButton
										asChild
										className={
											location.pathname === ele.url && "hover:bg-[#166700]"
										}
									>
										<Link
											to={ele.url}
											className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer ${
												location.pathname === ele.url ? "bg-[#166700]" : ""
											} hover:bg-red`}
										>
											<ele.icon
												className={`w-5 h-5 ${location.pathname === ele.url ? "text-white" : "text-[#2A2A4A]"}`}
											/>
											<span
												className={`font-madimi ${location.pathname === ele.url ? "text-white" : "text-[#2A2A4A]"} text-[16px]`}
											>
												{ele.title}
											</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup className="mt-8">
					{/* <SidebarGroupLabel className="font-madimi

                          text-bold
                          text-[16px]


                          text-[#2A2A4A]
                          font-large

                          ">Domains</SidebarGroupLabel> */}
					<SidebarGroupContent>
						{/* <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span
                        className="
                          font-madimi
                          font-normal
                          text-bold
                          text-[16px]


                          text-[#2A2A4A]

                        "
                      >
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu> */}
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
