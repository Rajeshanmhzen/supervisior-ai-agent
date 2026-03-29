import { motion } from "framer-motion";
import Button from "../../../components/shared/Button";
import InputField from "../../../components/shared/InputField";

type MotionVariants = {
  hidden: Record<string, unknown>;
  show: Record<string, unknown>;
};

type Props = {
  staggerContainer: MotionVariants;
  fadeUpItem: MotionVariants;
};

const ContactHeroSection = ({ staggerContainer, fadeUpItem }: Props) => {
  return (
    <motion.section
      className="py-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="w-full max-w-none lg:max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div>
          <h1 className="text-5xl lg:text-6xl font-headline font-extrabold text-on-surface leading-tight mb-6">
            Get In Touch
            <br />
            With Our Team
          </h1>
          <p className="text-on-surface-variant text-lg mb-12 max-w-md font-body">
            Fill out the form below and our team will get back to you within 1-2 business days.
          </p>
          <motion.div
            className="grid grid-cols-2 gap-4 sm:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
          >
            <motion.div
              className="p-6 rounded-2xl bg-surface-container-lowest"
              variants={fadeUpItem}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="w-10 h-10 bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-center mb-4 text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3 className="font-headline font-bold text-on-surface mb-1">Head Office</h3>
              <p className="text-sm text-on-surface-variant font-body">MaitiDevi, Kathmandu</p>
            </motion.div>
            <motion.div
              className="p-6 rounded-2xl bg-surface-container-lowest"
              variants={fadeUpItem}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <div className="w-10 h-10 bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-center mb-4 text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3 className="font-headline font-bold text-on-surface mb-1">Call Center</h3>
              <p className="text-sm text-on-surface-variant font-body">+977 9744588895</p>
            </motion.div>
            <motion.div
              className="p-6 rounded-2xl bg-surface-container-lowest"
              variants={fadeUpItem}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="w-10 h-10 bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-center mb-4 text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3 className="font-headline font-bold text-on-surface mb-1">Email</h3>
              <p className="text-sm text-on-surface-variant font-body">supervisioragent@gmail.com</p>
            </motion.div>
            <motion.div
              className="p-6 rounded-2xl bg-surface-container-lowest"
              variants={fadeUpItem}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <div className="w-10 h-10 bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-center mb-4 text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3 className="font-headline font-bold text-on-surface mb-1">Working Hours</h3>
              <p className="text-sm text-on-surface-variant font-body">
                Sunday - Friday (10:00 am - 05:00 pm)
              </p>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="w-full bg-surface-container-lowest rounded-3xl p-6 sm:p-8 lg:p-10"
          style={{ boxShadow: "0 20px 40px rgba(17, 24, 39, 0.06)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <form className="space-y-5 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <InputField label="First Name" placeholder="Enter first name" />
              <InputField label="Last Name" placeholder="Enter last name" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <InputField label="Work Email" placeholder="Enter work email" type="email" />
              <InputField label="Phone Number" placeholder="+1 Enter phone number" type="tel" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <InputField label="Job Title" placeholder="Enter job title" />
              <InputField label="Company Name" placeholder="Enter company name" />
            </div>
            <div>
              <textarea
                className="w-full px-5 py-3 rounded-lg bg-white text-sm text-on-surface placeholder:text-on-surface-variant border border-outline-variant/40 outline-none focus:outline-none focus:ring-0 focus:border-outline-variant/40 min-h-[140px]"
                placeholder="Enter message"
                rows={4}
              />
            </div>
            <Button type="submit" className="w-full py-4 rounded-lg shadow-lg">
              Submit
            </Button>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ContactHeroSection;
