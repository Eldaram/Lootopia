import { getSession } from "@/app/src/services/authService";
import AdminHelpPanel from "@/components/ui/help/AdminHelpPanel";
import ContactForm from "@/components/ui/help/ContactForm";
import FaqSection from "@/components/ui/help/FaqSection";
import { useEffect, useState } from "react";
import { View } from 'react-native';
import { useTheme } from '@/constants/ThemeProvider';
import { Colors } from '@/constants/Colors';
import FaqAdminPanel from "@/components/ui/help/FaqAdminPanel";


export default function HelpScreen() {
  const { theme } = useTheme();
  const themeColors = Colors[theme]; 
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const session = await getSession();
      if (session) {
        setUserRole(session.role);
      } else {
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, []);

  const isAdmin = userRole === "admin";
  

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <div className="help-container" style={{color: themeColors.text}}>
        <h1 className="text-2xl font-bold">📘 Centre d’aide</h1>
        <FaqSection />
        <ContactForm />
        {isAdmin && <AdminHelpPanel />}
        {isAdmin && <FaqAdminPanel />}
      </div>
    </View>
  );
}

