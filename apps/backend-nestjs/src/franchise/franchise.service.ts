import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import type {
  Franchise,
  CreateFranchiseDTO,
  UpdateFranchiseDTO,
} from '@franchise/shared';

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

@Injectable()
export class FranchiseService {
  constructor(private readonly databaseService: DatabaseService) {}

  private mapRowToFranchise(row: FranchiseRow): Franchise {
    return {
      id: row.id,
      name: row.name,
      ownerName: row.owner_name,
      email: row.email,
      phone: row.phone ?? '',
      address: row.address ?? '',
      city: row.city ?? '',
      state: row.state ?? '',
      status: row.status as Franchise['status'],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  findAll(search?: string): Franchise[] {
    const db = this.databaseService.getDatabase();

    if (search) {
      const stmt = db.prepare(`
        SELECT * FROM franchises
        WHERE name LIKE ? OR owner_name LIKE ? OR email LIKE ? OR city LIKE ?
        ORDER BY created_at DESC
      `);
      const pattern = `%${search}%`;
      const rows = stmt.all(pattern, pattern, pattern, pattern) as FranchiseRow[];
      return rows.map((row) => this.mapRowToFranchise(row));
    }

    const stmt = db.prepare('SELECT * FROM franchises ORDER BY created_at DESC');
    const rows = stmt.all() as FranchiseRow[];
    return rows.map((row) => this.mapRowToFranchise(row));
  }

  findOne(id: number): Franchise {
    const db = this.databaseService.getDatabase();
    const stmt = db.prepare('SELECT * FROM franchises WHERE id = ?');
    const row = stmt.get(id) as FranchiseRow | undefined;

    if (!row) {
      throw new NotFoundException(`Franchise with id ${id} not found`);
    }

    return this.mapRowToFranchise(row);
  }

  create(dto: CreateFranchiseDTO): Franchise {
    const db = this.databaseService.getDatabase();
    const stmt = db.prepare(`
      INSERT INTO franchises (name, owner_name, email, phone, address, city, state, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      dto.name,
      dto.ownerName,
      dto.email,
      dto.phone ?? null,
      dto.address ?? null,
      dto.city ?? null,
      dto.state ?? null,
      dto.status ?? 'pending',
    );

    return this.findOne(result.lastInsertRowid as number);
  }

  update(id: number, dto: UpdateFranchiseDTO): Franchise {
    // Verify it exists first
    this.findOne(id);

    const db = this.databaseService.getDatabase();
    const fields: string[] = [];
    const values: unknown[] = [];

    if (dto.name !== undefined) {
      fields.push('name = ?');
      values.push(dto.name);
    }
    if (dto.ownerName !== undefined) {
      fields.push('owner_name = ?');
      values.push(dto.ownerName);
    }
    if (dto.email !== undefined) {
      fields.push('email = ?');
      values.push(dto.email);
    }
    if (dto.phone !== undefined) {
      fields.push('phone = ?');
      values.push(dto.phone);
    }
    if (dto.address !== undefined) {
      fields.push('address = ?');
      values.push(dto.address);
    }
    if (dto.city !== undefined) {
      fields.push('city = ?');
      values.push(dto.city);
    }
    if (dto.state !== undefined) {
      fields.push('state = ?');
      values.push(dto.state);
    }
    if (dto.status !== undefined) {
      fields.push('status = ?');
      values.push(dto.status);
    }

    if (fields.length > 0) {
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      const stmt = db.prepare(
        `UPDATE franchises SET ${fields.join(', ')} WHERE id = ?`,
      );
      stmt.run(...values);
    }

    return this.findOne(id);
  }

  remove(id: number): void {
    this.findOne(id);

    const db = this.databaseService.getDatabase();
    const stmt = db.prepare('DELETE FROM franchises WHERE id = ?');
    stmt.run(id);
  }
}
