const fs = require('fs');
const path = require('path');

const adminDir = path.join('C:', 'Users', 'ASUS', 'source', 'repos', 'VehiclePartsSystem', 'Frontend', 'src', 'pages', 'Admin');
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
    const fullPath = path.join(adminDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    if (content.includes('adminNav') && !content.includes('Part Requests')) {
        content = content.replace(
`    {
        to: "/admin/reports",
        label: "Reports",`,
`    {
        to: "/admin/requests",
        label: "Part Requests",
        icon: FileText,
    },
    {
        to: "/admin/reports",
        label: "Reports",`
        );
        fs.writeFileSync(fullPath, content);
    }
}

const apiPath = path.join('C:', 'Users', 'ASUS', 'source', 'repos', 'VehiclePartsSystem', 'Frontend', 'src', 'api', 'admin.ts');
let apiContent = fs.readFileSync(apiPath, 'utf8');
if (!apiContent.includes('getAllPartRequests')) {
    apiContent += `\n\nexport const getAllPartRequests = async () => {
    const response = await api.get("/customer-requests/all");
    return response.data;
};

export const updatePartRequestStatus = async (id: number, status: string) => {
    const response = await api.put(\`/customer-requests/\${id}/status\`, { status });
    return response.data;
};\n`;
    fs.writeFileSync(apiPath, apiContent);
}

const appJsx = path.join('C:', 'Users', 'ASUS', 'source', 'repos', 'VehiclePartsSystem', 'Frontend', 'src', 'App.tsx');
let appContent = fs.readFileSync(appJsx, 'utf8');
if (!appContent.includes('PartRequests')) {
    appContent = appContent.replace('import Customers from "./pages/Admin/Customers";', 'import Customers from "./pages/Admin/Customers";\nimport PartRequests from "./pages/Admin/PartRequests";');
    appContent = appContent.replace('<Route path="customers" element={<Customers />} />', '<Route path="customers" element={<Customers />} />\n                    <Route path="requests" element={<PartRequests />} />');
    fs.writeFileSync(appJsx, appContent);
}

console.log('Update complete');
