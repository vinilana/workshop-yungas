import { Router, Request, Response } from "express";
import db from "../database.js";
import type {
  Franchise,
  CreateFranchiseDTO,
  UpdateFranchiseDTO,
  ApiResponse,
  ApiErrorResponse,
} from "@franchise/shared";
import { API_ROUTES } from "@franchise/shared";

const router = Router();

interface FranchiseRow {
  id: number;
  name: string;
  owner_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

function rowToFranchise(row: FranchiseRow): Franchise {
  return {
    id: row.id,
    name: row.name,
    ownerName: row.owner_name,
    email: row.email,
    phone: row.phone ?? "",
    address: row.address ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    status: row.status as Franchise["status"],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// GET /api/franchises
router.get(API_ROUTES.FRANCHISES, (req: Request, res: Response) => {
  const search = req.query.search as string | undefined;

  let rows: FranchiseRow[];
  if (search) {
    const pattern = `%${search}%`;
    rows = db
      .prepare(
        `SELECT * FROM franchises WHERE name LIKE ? OR owner_name LIKE ? OR email LIKE ? ORDER BY created_at DESC`
      )
      .all(pattern, pattern, pattern) as FranchiseRow[];
  } else {
    rows = db
      .prepare(`SELECT * FROM franchises ORDER BY created_at DESC`)
      .all() as FranchiseRow[];
  }

  const franchises = rows.map(rowToFranchise);
  const response: ApiResponse<Franchise[]> = { data: franchises };
  res.json(response);
});

// GET /api/franchises/:id
router.get(`${API_ROUTES.FRANCHISES}/:id`, (req: Request, res: Response) => {
  const row = db
    .prepare(`SELECT * FROM franchises WHERE id = ?`)
    .get(req.params.id) as FranchiseRow | undefined;

  if (!row) {
    const error: ApiErrorResponse = {
      error: "Not Found",
      message: "Franchise not found",
      statusCode: 404,
    };
    res.status(404).json(error);
    return;
  }

  const response: ApiResponse<Franchise> = { data: rowToFranchise(row) };
  res.json(response);
});

// POST /api/franchises
router.post(API_ROUTES.FRANCHISES, (req: Request, res: Response) => {
  const body = req.body as CreateFranchiseDTO;

  if (!body.name || !body.ownerName || !body.email) {
    const error: ApiErrorResponse = {
      error: "Validation Error",
      message: "Fields name, ownerName, and email are required",
      statusCode: 400,
    };
    res.status(400).json(error);
    return;
  }

  const result = db
    .prepare(
      `INSERT INTO franchises (name, owner_name, email, phone, address, city, state, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      body.name,
      body.ownerName,
      body.email,
      body.phone ?? null,
      body.address ?? null,
      body.city ?? null,
      body.state ?? null,
      body.status ?? "pending"
    );

  const row = db
    .prepare(`SELECT * FROM franchises WHERE id = ?`)
    .get(result.lastInsertRowid) as FranchiseRow;

  const response: ApiResponse<Franchise> = {
    data: rowToFranchise(row),
    message: "Franchise created successfully",
  };
  res.status(201).json(response);
});

function handleUpdateFranchise(req: Request, res: Response): void {
  const existing = db
    .prepare(`SELECT * FROM franchises WHERE id = ?`)
    .get(req.params.id) as FranchiseRow | undefined;

  if (!existing) {
    const error: ApiErrorResponse = {
      error: "Not Found",
      message: "Franchise not found",
      statusCode: 404,
    };
    res.status(404).json(error);
    return;
  }

  const body = req.body as UpdateFranchiseDTO;

  db.prepare(
    `UPDATE franchises
     SET name = ?, owner_name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).run(
    body.name ?? existing.name,
    body.ownerName ?? existing.owner_name,
    body.email ?? existing.email,
    body.phone ?? existing.phone,
    body.address ?? existing.address,
    body.city ?? existing.city,
    body.state ?? existing.state,
    body.status ?? existing.status,
    req.params.id
  );

  const row = db
    .prepare(`SELECT * FROM franchises WHERE id = ?`)
    .get(req.params.id) as FranchiseRow;

  const response: ApiResponse<Franchise> = {
    data: rowToFranchise(row),
    message: "Franchise updated successfully",
  };
  res.json(response);
}

// PUT /api/franchises/:id
router.put(`${API_ROUTES.FRANCHISES}/:id`, handleUpdateFranchise);

// PATCH /api/franchises/:id
router.patch(`${API_ROUTES.FRANCHISES}/:id`, handleUpdateFranchise);

// DELETE /api/franchises/:id
router.delete(
  `${API_ROUTES.FRANCHISES}/:id`,
  (req: Request, res: Response) => {
    const existing = db
      .prepare(`SELECT * FROM franchises WHERE id = ?`)
      .get(req.params.id) as FranchiseRow | undefined;

    if (!existing) {
      const error: ApiErrorResponse = {
        error: "Not Found",
        message: "Franchise not found",
        statusCode: 404,
      };
      res.status(404).json(error);
      return;
    }

    db.prepare(`DELETE FROM franchises WHERE id = ?`).run(req.params.id);

    const response: ApiResponse<null> = {
      data: null,
      message: "Franchise deleted successfully",
    };
    res.json(response);
  }
);

export default router;
