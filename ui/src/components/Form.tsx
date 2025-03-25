import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { FaUser, FaBirthdayCake, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';

interface FormValues {
  fullName: string;
  birthInfo: string;
  phoneNumber: string;
  altPhoneNumber: string;
  location: string;
  classSchedule: string;
}

const RegistrationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  birthInfo: Yup.date().required('Birth date is required'),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  altPhoneNumber: Yup.string().matches(/^\d{10}$/, 'Alternate phone number must be 10 digits'),
  location: Yup.string().required('Location is required'),
  classSchedule: Yup.string().required('Class schedule is required'),
});

const RegistrationForm: React.FC = () => {
  const initialValues: FormValues = {
    fullName: '',
    birthInfo: '',
    phoneNumber: '',
    altPhoneNumber: '',
    location: '',
    classSchedule: '',
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    try {
      await axios.post('http://localhost:5000/api/students', values);
      alert('Registration successful!');
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        alert(error.response.data.error);
      } else {
        console.error('Error submitting form:', error);
        alert('Registration failed!');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Register for Computer Class</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={RegistrationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label><FaUser /> Full Name</label>
              <Field name="fullName" type="text" />
              <ErrorMessage name="fullName" component="div" className="error" />
            </div>

            <div className="form-group">
              <label><FaBirthdayCake /> Birth Date</label>
              <Field name="birthInfo" type="date" />
              <ErrorMessage name="birthInfo" component="div" className="error" />
            </div>

            <div className="form-group">
              <label><FaPhone /> Phone Number</label>
              <Field name="phoneNumber" type="text" />
              <ErrorMessage name="phoneNumber" component="div" className="error" />
            </div>

            <div className="form-group">
              <label><FaPhone /> Alternate Phone Number</label>
              <Field name="altPhoneNumber" type="text" />
              <ErrorMessage name="altPhoneNumber" component="div" className="error" />
            </div>

            <div className="form-group">
              <label><FaMapMarkerAlt /> Location</label>
              <Field name="location" type="text" />
              <ErrorMessage name="location" component="div" className="error" />
            </div>

            <div className="form-group">
              <label><FaClock /> Class Schedule</label>
              <Field as="select" name="classSchedule">
                <option value="">Select a schedule</option>
                <option value="8:30am-10:30am">8:30am-10:30am</option>
                <option value="11:00am-13:00pm">11:00am-1:00pm</option>
                <option value="14:00pm-16:00pm">2:00pm-4:00pm</option>
              </Field>
              <ErrorMessage name="classSchedule" component="div" className="error" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              <FaPaperPlane /> {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegistrationForm;