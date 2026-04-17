// ============================================================
// DELETED CATEGORIES PAGE
// Shows inactive categories (backend soft-delete via isActive=false)
// GET /api/v1/categories?includeInactive=true  → filter isActive=false
// src/pages/DeletedCategoriesPage.tsx
// ============================================================
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FolderTree, RefreshCw } from 'lucide-react';
import PageTransition, { staggerItem } from '@/components/PageTransition';
import { Button }   from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge }    from '@/components/ui/badge';
import { useCategories } from '@/modules/categories/services/categoryApi';
import { formatDate } from '@/shared/utils/formatters';

function flattenCategories(cats: any[]): any[] {
  const result: any[] = [];
  for (const cat of cats) {
    result.push(cat);
    if (cat.children?.length) result.push(...flattenCategories(cat.children));
  }
  return result;
}

export default function DeletedCategoriesPage() {
  const navigate = useNavigate();
  const { data: allCategories = [], isLoading, error, refetch } = useCategories(true);

  const deleted = flattenCategories(allCategories).filter((c) => !c.isActive);

  if (error) return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-destructive">Failed to load categories</p>
        <Button onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-2" />Retry</Button>
      </div>
    </PageTransition>
  );

  return (
    <PageTransition>
      <div className="page-container max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/categories')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="page-title mb-0">Deleted Categories</h1>
            <p className="page-subtitle">Inactive / soft-deleted categories</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : deleted.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FolderTree className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-sm text-muted-foreground">No deleted categories found</p>
            </CardContent>
          </Card>
        ) : (
          <motion.div variants={staggerItem} initial="hidden" animate="visible" className="space-y-2">
            {deleted.map((cat) => (
              <Card key={cat.id}>
                <CardContent className="py-3 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                      {cat.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">{cat.fullPath || cat.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">Inactive</Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(cat.updatedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
