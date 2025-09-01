import React from 'react';
import { useForm } from 'react-hook-form';

interface IAdmissionForm {
  fullName: string;
  email: string;
  phone: string;
  course: string;
}

const Admissions = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<IAdmissionForm>();

  const onSubmit = (data: IAdmissionForm) => {
    console.log(data);
  };

  return (
    <>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admissions Management</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input {...register('fullName', { required: true })} className="w-full p-2 border border-gray-300 rounded" />
            {errors.fullName && <span className="text-red-500">This field is required</span>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input {...register('email', { required: true })} className="w-full p-2 border border-gray-300 rounded" />
            {errors.email && <span className="text-red-500">This field is required</span>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input {...register('phone', { required: true })} className="w-full p-2 border border-gray-300 rounded" />
            {errors.phone && <span className="text-red-500">This field is required</span>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Course</label>
            <select {...register('course', { required: true })} className="w-full p-2 border border-gray-300 rounded">
              <option value="">Select Course</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
            </select>
            {errors.course && <span className="text-red-500">This field is required</span>}
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
        </form>
      </div>
    </>
  );
};

export default Admissions;
