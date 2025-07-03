
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { Category } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface CategoryManagementProps {
  expenseCategories: Category[];
  incomeCategories: Category[];
  onAddCategory: (category: Omit<Category, 'id' | 'subcategories'>) => void;
  onAddSubcategory: (parentCategory: Category, subcategoryName: string) => void;
}

export function CategoryManagement({
  expenseCategories,
  incomeCategories,
  onAddCategory,
  onAddSubcategory,
}: CategoryManagementProps) {

  const { toast } = useToast();

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");

  const [currentCategoryType, setCurrentCategoryType] = useState<
    "expense" | "income"
  >("expense");
  const [parentCategory, setParentCategory] = useState<Category | null>(null);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({ title: "Category name cannot be empty", variant: "destructive" });
      return;
    }
    onAddCategory({ name: newCategoryName.trim(), type: currentCategoryType });
    toast({
      title: "Category Added",
      description: `Added "${newCategoryName.trim()}" category.`,
    });
    setNewCategoryName("");
    setIsCategoryDialogOpen(false);
  };

  const handleAddSubcategory = () => {
    if (!newSubcategoryName.trim() || !parentCategory) {
      toast({
        title: "Subcategory name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    onAddSubcategory(parentCategory, newSubcategoryName.trim());
    toast({
      title: "Subcategory Added",
      description: `Added "${newSubcategoryName.trim()}" to "${parentCategory.name}".`,
    });
    setNewSubcategoryName("");
    setParentCategory(null);
    setIsSubcategoryDialogOpen(false);
  };

  const openAddCategoryDialog = (type: "expense" | "income") => {
    setCurrentCategoryType(type);
    setIsCategoryDialogOpen(true);
  };

  const openAddSubcategoryDialog = (category: Category) => {
    setParentCategory(category);
    setIsSubcategoryDialogOpen(true);
  };

  const renderCategoryList = (
    categories: Category[],
    type: "expense" | "income"
  ) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline capitalize">
            {type} Categories
          </CardTitle>
          <CardDescription>
            Manage your {type} categories and subcategories.
          </CardDescription>
        </div>
        <Button size="sm" onClick={() => openAddCategoryDialog(type)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <p className="text-muted-foreground">No categories found.</p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {categories.map((cat) => (
              <AccordionItem value={cat.id} key={cat.id}>
                <AccordionTrigger className="font-medium">
                  {cat.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4">
                    {cat.subcategories.length > 0 ? (
                      <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                        {cat.subcategories.map((sub) => (
                          <li key={sub.id}>{sub.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No subcategories yet.
                      </p>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => openAddSubcategoryDialog(cat)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Subcategory
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      <Tabs defaultValue="expense" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expense">Expense Categories</TabsTrigger>
          <TabsTrigger value="income">Income Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="expense" className="mt-4">
          {renderCategoryList(expenseCategories, "expense")}
        </TabsContent>
        <TabsContent value="income" className="mt-4">
          {renderCategoryList(incomeCategories, "income")}
        </TabsContent>
      </Tabs>

      {/* Add Category Dialog */}
      <Dialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New {currentCategoryType} Category</DialogTitle>
            <DialogDescription>
              Enter a name for your new category.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category-name" className="text-right">
                Name
              </Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleAddCategory}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subcategory Dialog */}
      <Dialog
        open={isSubcategoryDialogOpen}
        onOpenChange={setIsSubcategoryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add Subcategory to "{parentCategory?.name}"
            </DialogTitle>
            <DialogDescription>
              Enter a name for your new subcategory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subcategory-name" className="text-right">
                Name
              </Label>
              <Input
                id="subcategory-name"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleAddSubcategory}>
              Add Subcategory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
