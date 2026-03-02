import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import type {
  Collaborator,
  CreateCollaboratorDTO,
  UpdateCollaboratorDTO,
} from '@franchise/shared';

interface CollaboratorRow {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  franchise_id: number;
  franchise_name: string;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class CollaboratorService {
  constructor(private readonly databaseService: DatabaseService) {}

  private mapRowToCollaborator(row: CollaboratorRow): Collaborator {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone ?? '',
      role: row.role,
      franchiseId: row.franchise_id,
      franchiseName: row.franchise_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  findAll(search?: string): Collaborator[] {
    const db = this.databaseService.getDatabase();

    if (search) {
      const stmt = db.prepare(`
        SELECT c.*, f.name AS franchise_name
        FROM collaborators c
        JOIN franchises f ON c.franchise_id = f.id
        WHERE c.name LIKE ? OR c.email LIKE ? OR c.role LIKE ? OR f.name LIKE ?
        ORDER BY c.created_at DESC
      `);
      const pattern = `%${search}%`;
      const rows = stmt.all(pattern, pattern, pattern, pattern) as CollaboratorRow[];
      return rows.map((row) => this.mapRowToCollaborator(row));
    }

    const stmt = db.prepare(`
      SELECT c.*, f.name AS franchise_name
      FROM collaborators c
      JOIN franchises f ON c.franchise_id = f.id
      ORDER BY c.created_at DESC
    `);
    const rows = stmt.all() as CollaboratorRow[];
    return rows.map((row) => this.mapRowToCollaborator(row));
  }

  findOne(id: number): Collaborator {
    const db = this.databaseService.getDatabase();
    const stmt = db.prepare(`
      SELECT c.*, f.name AS franchise_name
      FROM collaborators c
      JOIN franchises f ON c.franchise_id = f.id
      WHERE c.id = ?
    `);
    const row = stmt.get(id) as CollaboratorRow | undefined;

    if (!row) {
      throw new NotFoundException(`Collaborator with id ${id} not found`);
    }

    return this.mapRowToCollaborator(row);
  }

  create(dto: CreateCollaboratorDTO): Collaborator {
    const db = this.databaseService.getDatabase();

    const franchise = db.prepare('SELECT id FROM franchises WHERE id = ?').get(dto.franchiseId);
    if (!franchise) {
      throw new BadRequestException(`Franchise with id ${dto.franchiseId} not found`);
    }

    const stmt = db.prepare(`
      INSERT INTO collaborators (name, email, phone, role, franchise_id)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      dto.name,
      dto.email,
      dto.phone ?? null,
      dto.role,
      dto.franchiseId,
    );

    return this.findOne(result.lastInsertRowid as number);
  }

  update(id: number, dto: UpdateCollaboratorDTO): Collaborator {
    this.findOne(id);

    const db = this.databaseService.getDatabase();
    const fields: string[] = [];
    const values: unknown[] = [];

    if (dto.name !== undefined) {
      fields.push('name = ?');
      values.push(dto.name);
    }
    if (dto.email !== undefined) {
      fields.push('email = ?');
      values.push(dto.email);
    }
    if (dto.phone !== undefined) {
      fields.push('phone = ?');
      values.push(dto.phone);
    }
    if (dto.role !== undefined) {
      fields.push('role = ?');
      values.push(dto.role);
    }
    if (dto.franchiseId !== undefined) {
      const franchise = db.prepare('SELECT id FROM franchises WHERE id = ?').get(dto.franchiseId);
      if (!franchise) {
        throw new BadRequestException(`Franchise with id ${dto.franchiseId} not found`);
      }
      fields.push('franchise_id = ?');
      values.push(dto.franchiseId);
    }

    if (fields.length > 0) {
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      const stmt = db.prepare(
        `UPDATE collaborators SET ${fields.join(', ')} WHERE id = ?`,
      );
      stmt.run(...values);
    }

    return this.findOne(id);
  }

  remove(id: number): void {
    this.findOne(id);

    const db = this.databaseService.getDatabase();
    const stmt = db.prepare('DELETE FROM collaborators WHERE id = ?');
    stmt.run(id);
  }
}
