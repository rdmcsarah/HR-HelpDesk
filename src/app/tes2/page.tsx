"use client"
import { useState } from 'react';

export default function ExcelUploader() {
fetch("/api/auth", {
  method: "GET",
  credentials: "include"
})
  .then(res => res.json())
  .then(console.log);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">

        fe

        </div>




  )



}