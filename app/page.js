'use client';

import { useState, useEffect } from 'react';
import {
  KanbanBoardProvider,
  KanbanBoard,
  KanbanBoardColumn,
  KanbanBoardColumnHeader,
  KanbanBoardColumnTitle,
  KanbanBoardColumnList,
  KanbanBoardColumnListItem,
  KanbanBoardCard,
  KanbanBoardCardTitle,
  KanbanBoardCardDescription,
  KanbanBoardExtraMargin,
  KanbanColorCircle,
} from '@/components/kanban';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useJsLoaded } from '@/lib/use-js-loaded';

// Sample columns for the kanban board
const initialColumns = [
  { id: 'todo', name: 'To Do' },
  { id: 'in-progress', name: 'In Progress' },
  { id: 'review', name: 'Review' },
  { id: 'done', name: 'Done' },
];

// Sample tasks/cards for the kanban board
const initialData = [
  {
    id: '1',
    title: 'Design landing page',
    description: 'Create wireframes and mockups for the new landing page',
    fullDescription: 'Design a modern, responsive landing page that showcases our product features. Include wireframes for desktop, tablet, and mobile layouts. Focus on user experience and conversion optimization.',
    column: 'todo',
    priority: 'high',
    assignee: 'John Doe',
    dueDate: '2024-02-15',
    tags: ['design', 'ui/ux', 'frontend'],
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Set up login/signup functionality with JWT tokens',
    fullDescription: 'Implement secure user authentication system using JWT tokens. Include password hashing, email verification, password reset functionality, and session management.',
    column: 'todo',
    priority: 'medium',
    assignee: 'Jane Smith',
    dueDate: '2024-02-20',
    tags: ['backend', 'security', 'auth'],
    createdAt: '2024-01-12',
  },
  {
    id: '3',
    title: 'Database schema design',
    description: 'Design the database structure for user data and content',
    fullDescription: 'Create comprehensive database schema including user tables, content management, relationships, and indexes. Ensure scalability and performance optimization.',
    column: 'in-progress',
    priority: 'high',
    assignee: 'Mike Johnson',
    dueDate: '2024-02-10',
    tags: ['database', 'backend', 'architecture'],
    createdAt: '2024-01-08',
  },
  {
    id: '4',
    title: 'API endpoints for user management',
    description: 'Create REST APIs for user CRUD operations',
    fullDescription: 'Develop RESTful API endpoints for user registration, login, profile management, and user administration. Include proper validation, error handling, and API documentation.',
    column: 'in-progress',
    priority: 'medium',
    assignee: 'Sarah Wilson',
    dueDate: '2024-02-18',
    tags: ['backend', 'api', 'rest'],
    createdAt: '2024-01-14',
  },
  {
    id: '5',
    title: 'Unit tests for authentication',
    description: 'Write comprehensive tests for login/signup flows',
    fullDescription: 'Create unit tests and integration tests for authentication module. Include edge cases, error scenarios, and security testing to ensure robust authentication system.',
    column: 'review',
    priority: 'low',
    assignee: 'Tom Brown',
    dueDate: '2024-02-25',
    tags: ['testing', 'qa', 'backend'],
    createdAt: '2024-01-16',
  },
  {
    id: '6',
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated testing and deployment',
    fullDescription: 'Implement continuous integration and deployment pipeline using GitHub Actions. Include automated testing, code quality checks, and deployment to staging and production environments.',
    column: 'done',
    priority: 'medium',
    assignee: 'Alex Davis',
    dueDate: '2024-01-30',
    tags: ['devops', 'ci/cd', 'automation'],
    createdAt: '2024-01-05',
  },
  {
    id: '7',
    title: 'Project documentation',
    description: 'Write README and API documentation',
    fullDescription: 'Create comprehensive project documentation including setup instructions, API documentation, contribution guidelines, and deployment procedures.',
    column: 'done',
    priority: 'low',
    assignee: 'Lisa Garcia',
    dueDate: '2024-02-05',
    tags: ['documentation', 'readme', 'guides'],
    createdAt: '2024-01-03',
  },
];

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'border-l-red-500';
    case 'medium':
      return 'border-l-yellow-500';
    case 'low':
      return 'border-l-green-500';
    default:
      return 'border-l-gray-300';
  }
};

const getPriorityBadge = (priority) => {
  const colors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[priority]}`}>
      {priority}
    </span>
  );
};

export default function Home() {
  const [kanbanData, setKanbanData] = useState(initialData);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedCard, setEditedCard] = useState(null);
  const jsLoaded = useJsLoaded();

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setEditedCard({ ...card });
    setIsModalOpen(true);
  };

  const handleSaveCard = () => {
    if (editedCard) {
      const updatedData = kanbanData.map(card => 
        card.id === editedCard.id ? editedCard : card
      );
      updateKanbanData(updatedData);
      setIsModalOpen(false);
      setSelectedCard(null);
      setEditedCard(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
    setEditedCard(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Utility function to ensure data integrity
  const updateKanbanData = (newData) => {
    // Remove any potential duplicates by ID
    const uniqueData = newData.filter((card, index, arr) => 
      arr.findIndex(c => c.id === card.id) === index
    );
    setKanbanData(uniqueData);
  };

  const handleDropOverColumn = (data, columnId) => {
    const cardData = JSON.parse(data);
    
    // Only update if the card is actually changing columns
    if (cardData.column === columnId) return;
    
    const updatedData = kanbanData.map(card => 
      card.id === cardData.id ? { ...card, column: columnId } : card
    );
    updateKanbanData(updatedData);
  };

  const handleDropOverListItem = (data, dropDirection, targetCardId) => {
    const cardData = JSON.parse(data);
    const targetCard = kanbanData.find(card => card.id === targetCardId);
    if (!targetCard || cardData.id === targetCardId) return;

    // Create a copy of all cards without the dragged card
    const filteredData = kanbanData.filter(card => card.id !== cardData.id);
    
    // Find the target card in the filtered data
    const targetIndex = filteredData.findIndex(card => card.id === targetCardId);
    if (targetIndex === -1) return;
    
    // Calculate insert position
    const insertIndex = dropDirection === 'top' ? targetIndex : targetIndex + 1;
    
    // Create updated card with new column
    const updatedCard = { ...cardData, column: targetCard.column };
    
    // Insert the card at the correct position
    const newData = [...filteredData];
    newData.splice(insertIndex, 0, updatedCard);
    
    updateKanbanData(newData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Project Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your tasks with drag-and-drop functionality
          </p>
        </div>
        
        <div className="h-[calc(100vh-200px)]">
          <KanbanBoardProvider>
            <KanbanBoard className="h-full">
              {initialColumns.map((column) => (
                <KanbanBoardColumn
                  key={column.id}
                  columnId={column.id}
                  onDropOverColumn={(data) => handleDropOverColumn(data, column.id)}
                >
                  <KanbanBoardColumnHeader>
                    <KanbanBoardColumnTitle columnId={column.id}>
                      <KanbanColorCircle color="primary" />
                      {column.name}
                    </KanbanBoardColumnTitle>
                    <Badge variant="secondary" className="text-xs">
                      {kanbanData.filter(item => item.column === column.id).length}
                    </Badge>
                  </KanbanBoardColumnHeader>
                  
                  <KanbanBoardColumnList>
                    {kanbanData
                      .filter(card => card.column === column.id)
                      .map((card, index) => (
                        <KanbanBoardColumnListItem
                          key={`${column.id}-${card.id}-${index}`}
                          cardId={card.id}
                          onDropOverListItem={(data, direction) => 
                            handleDropOverListItem(data, direction, card.id)
                          }
                        >
                          <KanbanBoardCard
                            data={card}
                            onClick={() => handleCardClick(card)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <KanbanBoardCardTitle>
                                {card.title}
                              </KanbanBoardCardTitle>
                              {getPriorityBadge(card.priority)}
                            </div>
                            
                            <KanbanBoardCardDescription>
                              {card.description}
                            </KanbanBoardCardDescription>
                            
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                    {card.assignee ? card.assignee.charAt(0).toUpperCase() : card.title.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                {card.tags && card.tags.length > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    {card.tags[0]}
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                #{card.id}
                              </span>
                            </div>
                          </KanbanBoardCard>
                        </KanbanBoardColumnListItem>
                      ))}
                  </KanbanBoardColumnList>
                </KanbanBoardColumn>
              ))}
              <KanbanBoardExtraMargin />
            </KanbanBoard>
          </KanbanBoardProvider>
        </div>

        {/* Card Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {selectedCard?.title}
              </DialogTitle>
              <DialogDescription>
                Task details and information
              </DialogDescription>
            </DialogHeader>

            {editedCard && (
              <div className="space-y-6">
                {/* Priority and Status */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">Priority:</Label>
                    {getPriorityBadge(editedCard.priority)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">Status:</Label>
                    <Badge variant="outline" className="capitalize">
                      {editedCard.column.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title
                  </Label>
                  <input
                    id="title"
                    type="text"
                    value={editedCard.title}
                    onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={editedCard.description}
                    onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
                    className="min-h-[80px]"
                    placeholder="Brief description of the task..."
                  />
                </div>

                {/* Full Description */}
                <div className="space-y-2">
                  <Label htmlFor="fullDescription" className="text-sm font-medium">
                    Detailed Description
                  </Label>
                  <Textarea
                    id="fullDescription"
                    value={editedCard.fullDescription}
                    onChange={(e) => setEditedCard({ ...editedCard, fullDescription: e.target.value })}
                    className="min-h-[120px]"
                    placeholder="Detailed description of the task..."
                  />
                </div>

                {/* Assignee and Due Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignee" className="text-sm font-medium">
                      Assignee
                    </Label>
                    <input
                      id="assignee"
                      type="text"
                      value={editedCard.assignee || ''}
                      onChange={(e) => setEditedCard({ ...editedCard, assignee: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                      placeholder="Assigned to..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="text-sm font-medium">
                      Due Date
                    </Label>
                    <input
                      id="dueDate"
                      type="date"
                      value={editedCard.dueDate || ''}
                      onChange={(e) => setEditedCard({ ...editedCard, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {editedCard.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Created
                    </Label>
                    <p className="text-sm">
                      {editedCard.createdAt ? formatDate(editedCard.createdAt) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Task ID
                    </Label>
                    <p className="text-sm">#{editedCard.id}</p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleSaveCard}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
