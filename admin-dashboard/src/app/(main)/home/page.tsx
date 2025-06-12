/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import {
  createWallpaper,
  deleteWallpaper,
  getWallpapers,
  updateWallpaper,
  WALLPAPER_CATEGORIES,
  WALLPAPER_STYLES,
  type CreateWallpaperData,
  type UpdateWallpaperData,
  type Wallpaper,
  type WallpaperPaginationResponse,
} from "@/api/wallpaper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Eye,
  Image,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [wallpaperToDelete, setWallpaperToDelete] = useState<Wallpaper | null>(
    null
  );
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStyle, setSelectedStyle] = useState("all");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalWallpapers: 0,
    limit: 12,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Form state for create/edit
  const [formData, setFormData] = useState<CreateWallpaperData>({
    title: "",
    description: "",
    imageUrl: "",
    keywords: [],
    category: "lord_krishna",
    wallpaperStyle: "anime",
  });

  const [keywordInput, setKeywordInput] = useState("");
  const [editFormData, setEditFormData] = useState<UpdateWallpaperData>({});

  useEffect(() => {
    fetchWallpapers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage, selectedCategory, selectedStyle, searchKeyword]);

  const fetchWallpapers = async () => {
    try {
      setLoading(true);
      const response = await getWallpapers({
        page: pagination.currentPage,
        limit: pagination.limit,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        wallpaperStyle: selectedStyle !== "all" ? selectedStyle : undefined,
        keyword: searchKeyword || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (response.success && response.data) {
        const data: WallpaperPaginationResponse = response.data;
        setWallpapers(data.wallpapers);
        setPagination(data.pagination);
      } else {
        toast.error(response.message || "Failed to fetch wallpapers");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch wallpapers");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWallpaper = async () => {
    try {
      // Validate form
      if (!formData.title.trim()) {
        toast.error("Title is required");
        return;
      }
      if (!formData.description.trim()) {
        toast.error("Description is required");
        return;
      }
      if (!formData.imageUrl.trim()) {
        toast.error("Image URL is required");
        return;
      }
      if (formData.keywords.length === 0) {
        toast.error("At least one keyword is required");
        return;
      }

      setLoading(true);
      const response = await createWallpaper(formData);

      if (response.success) {
        toast.success("Wallpaper created successfully");
        setShowCreateForm(false);
        resetCreateForm();
        fetchWallpapers();
      } else {
        toast.error(response.message || "Failed to create wallpaper");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to create wallpaper");
    } finally {
      setLoading(false);
    }
  };

  const handleEditWallpaper = async () => {
    if (!selectedWallpaper) return;

    try {
      setLoading(true);
      const response = await updateWallpaper(
        selectedWallpaper._id,
        editFormData
      );

      if (response.success) {
        toast.success("Wallpaper updated successfully");
        setShowEditForm(false);
        setSelectedWallpaper(null);
        setEditFormData({});
        fetchWallpapers();
      } else {
        toast.error(response.message || "Failed to update wallpaper");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to update wallpaper");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWallpaper = async (wallpaper: Wallpaper) => {
    setWallpaperToDelete(wallpaper);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteWallpaper = async () => {
    if (!wallpaperToDelete) return;

    try {
      setLoading(true);
      const response = await deleteWallpaper(wallpaperToDelete._id);

      if (response.success) {
        toast.success("Wallpaper deleted successfully");
        setShowDeleteConfirm(false);
        setWallpaperToDelete(null);
        fetchWallpapers();
      } else {
        toast.error(response.message || "Failed to delete wallpaper");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to delete wallpaper");
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = () => {
    if (
      keywordInput.trim() &&
      !formData.keywords.includes(keywordInput.trim())
    ) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()],
      });
      setKeywordInput("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((k) => k !== keywordToRemove),
    });
  };

  const resetCreateForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      keywords: [],
      category: "lord_krishna",
      wallpaperStyle: "anime",
    });
    setKeywordInput("");
  };

  const openEditForm = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper);
    setEditFormData({
      title: wallpaper.title,
      description: wallpaper.description,
      imageUrl: wallpaper.imageUrl,
      keywords: wallpaper.keywords,
      category: wallpaper.category,
      wallpaperStyle: wallpaper.wallpaperStyle,
      isActive: wallpaper.isActive,
    });
    setShowEditForm(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCategoryName = (category: string) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Wallpaper Management
          </h1>
          <p className="text-muted-foreground">
            Manage wallpapers and their content
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Wallpaper
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Wallpapers
            </CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pagination.totalWallpapers}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Page</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.currentPage}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search wallpapers..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-9 px-3 py-1 text-sm border border-input bg-background rounded-md"
              >
                <option value="all">All Categories</option>
                {WALLPAPER_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {formatCategoryName(category)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <select
                id="style"
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full h-9 px-3 py-1 text-sm border border-input bg-background rounded-md"
              >
                <option value="all">All Styles</option>
                {WALLPAPER_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={fetchWallpapers} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Wallpaper</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter wallpaper title..."
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="Enter image URL..."
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                placeholder="Enter wallpaper description..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full min-h-[100px] px-3 py-2 text-sm border border-input bg-background rounded-md resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category-select">Category</Label>
                <select
                  id="category-select"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full h-9 px-3 py-1 text-sm border border-input bg-background rounded-md"
                >
                  {WALLPAPER_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {formatCategoryName(category)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="style-select">Style</Label>
                <select
                  id="style-select"
                  value={formData.wallpaperStyle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      wallpaperStyle: e.target.value as "anime" | "real",
                    })
                  }
                  className="w-full h-9 px-3 py-1 text-sm border border-input bg-background rounded-md"
                >
                  {WALLPAPER_STYLES.map((style) => (
                    <option key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <div className="flex gap-2">
                <Input
                  id="keywords"
                  placeholder="Add keyword..."
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addKeyword())
                  }
                />
                <Button type="button" onClick={addKeyword} variant="outline">
                  Add
                </Button>
              </div>
              {formData.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-secondary rounded-md"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  resetCreateForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateWallpaper} disabled={loading}>
                {loading ? "Creating..." : "Create Wallpaper"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallpapers Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Wallpapers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && wallpapers.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading wallpapers...</p>
              </div>
            </div>
          ) : wallpapers.length === 0 ? (
            <div className="text-center py-8">
              <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No wallpapers found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first wallpaper to get started
              </p>
              <Button onClick={() => setShowCreateForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Wallpaper
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {wallpapers.map((wallpaper) => (
                <Card
                  key={wallpaper._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[3/4] relative">
                    <img
                      src={wallpaper.imageUrl}
                      alt={wallpaper.title}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          wallpaper.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {wallpaper.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-1 truncate">
                      {wallpaper.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {wallpaper.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span className="capitalize">
                        {formatCategoryName(wallpaper.category)}
                      </span>
                      <span className="capitalize">
                        {wallpaper.wallpaperStyle}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {wallpaper.downloadCount}
                      </div>
                      <span>{formatDate(wallpaper.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedWallpaper(wallpaper);
                          setShowDetails(true);
                        }}
                        className="flex-1 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditForm(wallpaper)}
                        className="flex-1 text-xs"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteWallpaper(wallpaper)}
                        className="text-xs text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.totalWallpapers
                )}
                of {pagination.totalWallpapers} wallpapers
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      currentPage: pagination.currentPage - 1,
                    })
                  }
                  disabled={!pagination.hasPrevPage}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={
                            page === pagination.currentPage
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setPagination({ ...pagination, currentPage: page })
                          }
                        >
                          {page}
                        </Button>
                      );
                    }
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      currentPage: pagination.currentPage + 1,
                    })
                  }
                  disabled={!pagination.hasNextPage}
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Form Modal */}
      {showEditForm && selectedWallpaper && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit Wallpaper</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEditForm(false);
                    setSelectedWallpaper(null);
                    setEditFormData({});
                  }}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editFormData.title || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-imageUrl">Image URL</Label>
                  <Input
                    id="edit-imageUrl"
                    value={editFormData.imageUrl || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        imageUrl: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <textarea
                  id="edit-description"
                  value={editFormData.description || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  className="w-full min-h-[100px] px-3 py-2 text-sm border border-input bg-background rounded-md resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <select
                    id="edit-category"
                    value={editFormData.category || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        category: e.target.value,
                      })
                    }
                    className="w-full h-9 px-3 py-1 text-sm border border-input bg-background rounded-md"
                  >
                    {WALLPAPER_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {formatCategoryName(category)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-style">Style</Label>
                  <select
                    id="edit-style"
                    value={editFormData.wallpaperStyle || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        wallpaperStyle: e.target.value as "anime" | "real",
                      })
                    }
                    className="w-full h-9 px-3 py-1 text-sm border border-input bg-background rounded-md"
                  >
                    {WALLPAPER_STYLES.map((style) => (
                      <option key={style} value={style}>
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-active">Status</Label>
                  <select
                    id="edit-active"
                    value={editFormData.isActive ? "true" : "false"}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        isActive: e.target.value === "true",
                      })
                    }
                    className="w-full h-9 px-3 py-1 text-sm border border-input bg-background rounded-md"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Keywords</Label>
                <div className="flex flex-wrap gap-1">
                  {editFormData.keywords?.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-secondary rounded-md"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() =>
                          setEditFormData({
                            ...editFormData,
                            keywords: editFormData.keywords?.filter(
                              (k) => k !== keyword
                            ),
                          })
                        }
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditForm(false);
                    setSelectedWallpaper(null);
                    setEditFormData({});
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleEditWallpaper} disabled={loading}>
                  {loading ? "Updating..." : "Update Wallpaper"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedWallpaper && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Wallpaper Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedWallpaper(null);
                  }}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="aspect-[3/4] relative">
                    <img
                      src={selectedWallpaper.imageUrl}
                      alt={selectedWallpaper.title}
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {selectedWallpaper.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedWallpaper.description}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">
                        {formatCategoryName(selectedWallpaper.category)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Style</p>
                      <p className="font-medium capitalize">
                        {selectedWallpaper.wallpaperStyle}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Downloads</p>
                      <p className="font-medium">
                        {selectedWallpaper.downloadCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p
                        className={`font-medium ${
                          selectedWallpaper.isActive
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedWallpaper.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Keywords
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedWallpaper.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="px-2 py-1 text-xs bg-secondary rounded-md"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Created By
                    </p>
                    <p className="font-medium">
                      {selectedWallpaper.adminId.firstName}{" "}
                      {selectedWallpaper.adminId.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedWallpaper.adminId.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Dates</p>
                    <p className="text-sm">
                      <span className="font-medium">Created:</span>{" "}
                      {formatDate(selectedWallpaper.createdAt)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Updated:</span>{" "}
                      {formatDate(selectedWallpaper.updatedAt)}
                    </p>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Wallpaper ID
                    </p>
                    <p className="font-mono text-xs bg-muted p-2 rounded">
                      {selectedWallpaper._id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => openEditForm(selectedWallpaper)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedWallpaper(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && wallpaperToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">
                Delete Wallpaper
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete the wallpaper{" "}
                <span className="font-semibold">{wallpaperToDelete.title}</span>
                ? This action cannot be undone.
              </p>

              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <Trash2 className="h-4 w-4" />
                  <span className="font-medium">
                    This will permanently delete:
                  </span>
                </div>
                <ul className="mt-2 text-sm text-muted-foreground ml-6 space-y-1">
                  <li>• Wallpaper record and metadata</li>
                  <li>• Download statistics</li>
                  <li>• Associated keywords and tags</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setWallpaperToDelete(null);
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteWallpaper}
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete Wallpaper
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
