import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./table";

export default {
  title: "UI/Table",
  component: Table,
  subcomponents: { TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption },
};

export const Basic = () => (
  <Table>
    <TableCaption>Sample table caption</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Jane Doe</TableCell>
        <TableCell>jane@example.com</TableCell>
        <TableCell>Active</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>John Smith</TableCell>
        <TableCell>john@example.com</TableCell>
        <TableCell>Inactive</TableCell>
      </TableRow>
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colSpan={3}>Footer content</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
);
