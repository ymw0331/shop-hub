import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/auth';
import { PageContainer, PageHeader } from '../../components/ui/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import UserMenu from '../../components/nav/UserMenu';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, Lock, MapPin, Save, Shield, Edit } from 'lucide-react';
import { cn } from '../../lib/utils';
import usePageTitle from '../../hooks/usePageTitle';

export default function UserProfile() {
  usePageTitle('My Profile');
  // context
  const [auth, setAuth] = useAuth();

  // state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth?.user) {
      const { name, email, address } = auth.user;
      setName(name || "");
      setEmail(email || "");
      setAddress(address || "");
    }
  }, [auth?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.put(`/profile/${auth.user.id}`, {
        name,
        password,
        address,
      });

      if (data?.error) {
        toast.error(data.error);
      } else {
        setAuth({ ...auth, user: data });

        // local storage update
        let ls = localStorage.getItem('auth');
        ls = JSON.parse(ls);
        ls.user = data;
        localStorage.setItem('auth', JSON.stringify(ls));
        toast.success("Profile updated successfully!");
        setPassword(""); // Clear password field after successful update
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formSections = [
    {
      title: "Personal Information",
      description: "Update your personal details and contact information",
      icon: User,
      fields: [
        {
          label: "Full Name",
          value: name,
          onChange: setName,
          type: "text",
          placeholder: "Enter your full name",
          icon: User,
          required: true
        },
        {
          label: "Email Address", 
          value: email,
          onChange: setEmail,
          type: "email",
          placeholder: "Enter your email",
          icon: Mail,
          disabled: true,
          helperText: "Email cannot be changed for security reasons"
        }
      ]
    },
    {
      title: "Security & Address",
      description: "Update your password and delivery address",
      icon: Shield,
      fields: [
        {
          label: "New Password",
          value: password,
          onChange: setPassword,
          type: "password", 
          placeholder: "Enter new password (leave blank to keep current)",
          icon: Lock,
          helperText: "Leave empty to keep your current password"
        },
        {
          label: "Address",
          value: address,
          onChange: setAddress,
          type: "textarea",
          placeholder: "Enter your delivery address",
          icon: MapPin,
          rows: 3
        }
      ]
    }
  ];

  return (
    <PageContainer>
      <PageHeader 
        title={`Profile Settings`}
        subtitle={`Manage your account information, ${auth?.user?.name}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <UserMenu />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Overview Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-6">
                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                        <User className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">
                          Welcome, {auth?.user?.name}!
                        </h2>
                        <p className="text-white/90">
                          Keep your profile information up to date for the best experience
                        </p>
                      </div>
                      <Edit className="w-6 h-6 text-white/80" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Form Sections */}
              {formSections.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (sectionIndex + 1) * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                          <section.icon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            {section.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                            {section.description}
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {section.fields.map((field, fieldIndex) => (
                        <div key={field.label} className="space-y-2">
                          {field.type === "textarea" ? (
                            <div className="w-full">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <div className="flex items-center gap-2">
                                  <field.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                  {field.label}
                                  {field.required && <span className="text-red-500">*</span>}
                                </div>
                              </label>
                              <textarea
                                className={cn(
                                  "flex min-h-[80px] w-full rounded-md border bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100",
                                  "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                                  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                                  "disabled:cursor-not-allowed disabled:opacity-50",
                                  "transition-all duration-200",
                                  "border-gray-300 dark:border-gray-600"
                                )}
                                placeholder={field.placeholder}
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                rows={field.rows || 3}
                              />
                              {field.helperText && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{field.helperText}</p>
                              )}
                            </div>
                          ) : (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <div className="flex items-center gap-2">
                                  <field.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                  {field.label}
                                  {field.required && <span className="text-red-500">*</span>}
                                </div>
                              </label>
                              <Input
                                type={field.type}
                                placeholder={field.placeholder}
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                disabled={field.disabled}
                                className="w-full"
                              />
                              {field.helperText && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{field.helperText}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="flex justify-end"
              >
                <Button
                  type="submit"
                  loading={loading}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 text-base font-medium"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {loading ? "Updating Profile..." : "Update Profile"}
                </Button>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};