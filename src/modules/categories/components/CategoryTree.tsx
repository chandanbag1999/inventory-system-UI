// ============================================================
// CATEGORY TREE COMPONENT - Hierarchical Tree View
// src/modules/categories/components/CategoryTree.tsx
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Edit2, Trash2, Package, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Category } from '../types/category.types';

interface CategoryTreeProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  searchTerm?: string;
  showActions?: boolean;
}

interface CategoryRowProps {
  category: Category;
  level: number;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  searchTerm?: string;
  showActions?: boolean;
}

function CategoryRow({ category, level, onEdit, onDelete, searchTerm, showActions }: CategoryRowProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  const matchesSearch = searchTerm
    ? category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.fullPath.toLowerCase().includes(searchTerm.toLowerCase())
    : true;

  const childMatchesSearch = (cat: Category): boolean => {
    if (!searchTerm) return true;
    if (cat.name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    return cat.children?.some(childMatchesSearch) || false;
  };

  const hasVisibleChildren = category.children?.some(childMatchesSearch) || false;

  if (!matchesSearch && !hasVisibleChildren) {
    return null;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'flex items-center gap-2 py-3 px-3 rounded-lg hover:bg-muted/50 transition-colors group',
          level > 0 && 'ml-6 border-l-2 border-muted'
        )}
      >
        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          className={cn('h-7 w-7 p-0 shrink-0', !hasChildren && 'invisible')}
          onClick={() => setExpanded(!expanded)}
        >
          <ChevronRight
            className={cn(
              'h-4 w-4 transition-transform',
              expanded && 'rotate-90'
            )}
          />
        </Button>

        {/* Category Icon */}
        <div className={cn(
          'h-8 w-8 rounded-md flex items-center justify-center text-sm font-bold shrink-0',
          level === 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
        )}>
          {category.name.charAt(0).toUpperCase()}
        </div>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{category.name}</span>
            {!category.isActive && (
              <Badge variant="secondary" className="text-xs shrink-0">Inactive</Badge>
            )}
          </div>
          {category.fullPath !== category.name && (
            <p className="text-xs text-muted-foreground truncate">{category.fullPath}</p>
          )}
        </div>

        {/* Product Count Badge */}
        <Badge variant="outline" className="text-xs shrink-0">
          <Package className="h-3 w-3 mr-1" />
          {category.productCount}
        </Badge>

        {/* Actions */}
        {showActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 opacity-0 group-hover:opacity-100 p-1 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit(category)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(category.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {category.children.map((child) => (
              <CategoryRow
                key={child.id}
                category={child}
                level={level + 1}
                onEdit={onEdit}
                onDelete={onDelete}
                searchTerm={searchTerm}
                showActions={showActions}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function CategoryTree({
  categories,
  onEdit,
  onDelete,
  searchTerm,
  showActions = true,
}: CategoryTreeProps) {
  return (
    <div className="space-y-1">
      {categories.map((category) => (
        <CategoryRow
          key={category.id}
          category={category}
          level={0}
          onEdit={onEdit}
          onDelete={onDelete}
          searchTerm={searchTerm}
          showActions={showActions}
        />
      ))}
      {categories.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No categories found</p>
          <p className="text-xs mt-1">Create your first category to get started</p>
        </div>
      )}
    </div>
  );
}