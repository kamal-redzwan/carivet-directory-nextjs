'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Download,
  Upload,
  Search,
  Edit,
  Trash2,
  Eye,
  Phone,
  Globe,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading';

interface Clinic {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  phone: string;
  email?: string;
  website?: string;
  emergency: boolean;
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
}

export default function AdminClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [selectedClinics, setSelectedClinics] = useState<string[]>([]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchClinics = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockClinics: Clinic[] = [
          {
            id: '1',
            name: 'Animal Medical Centre Sdn Bhd (AMC)',
            street: 'Wisma Medivet, 8, Jln Tun Razak',
            city: 'Kuala Lumpur',
            state: 'Kuala Lumpur',
            phone: '+60340426742',
            email: 'info@amc.com.my',
            website: 'https://animalhospital.com.my',
            emergency: true,
            verification_status: 'verified',
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-02-01T14:20:00Z',
          },
          {
            id: '2',
            name: 'Petcare Enterprise Sdn Bhd',
            street: '9145 & 9146, Jalan Bandar 4',
            city: 'Taman Melawati',
            state: 'Selangor',
            phone: '+60341067515',
            website: 'https://petcare.com.my/',
            emergency: false,
            verification_status: 'pending',
            created_at: '2024-02-10T09:15:00Z',
            updated_at: '2024-02-10T09:15:00Z',
          },
          {
            id: '3',
            name: 'Happy Tails Veterinary Clinic',
            street: '60G, Jalan SS 2/64, Ss 2',
            city: 'Petaling Jaya',
            state: 'Selangor',
            phone: '+60378742773',
            emergency: false,
            verification_status: 'rejected',
            created_at: '2024-01-28T16:45:00Z',
            updated_at: '2024-02-05T11:30:00Z',
          },
          {
            id: '4',
            name: 'VetCare Animal Hospital',
            street: '32, Jalan Dato Sulaiman',
            city: 'Johor Bahru',
            state: 'Johor',
            phone: '+60127723330',
            emergency: true,
            verification_status: 'verified',
            created_at: '2024-01-20T08:00:00Z',
            updated_at: '2024-01-25T12:00:00Z',
          },
          {
            id: '5',
            name: 'CityVet Bangsar',
            street: '18, Jalan Telawi 3',
            city: 'Kuala Lumpur',
            state: 'Kuala Lumpur',
            phone: '+60322827668',
            emergency: false,
            verification_status: 'pending',
            created_at: '2024-02-15T14:30:00Z',
            updated_at: '2024-02-15T14:30:00Z',
          },
        ];
        setClinics(mockClinics);
        setLoading(false);
      }, 1000);
    };

    fetchClinics();
  }, []);

  const filteredClinics = clinics.filter((clinic) => {
    const matchesSearch =
      clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || clinic.verification_status === statusFilter;
    const matchesState = stateFilter === 'all' || clinic.state === stateFilter;

    return matchesSearch && matchesStatus && matchesState;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge
            variant='default'
            className='bg-green-100 text-green-800 border-green-200'
          >
            <CheckCircle size={12} className='mr-1' />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge
            variant='secondary'
            className='bg-yellow-100 text-yellow-800 border-yellow-200'
          >
            <Clock size={12} className='mr-1' />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge
            variant='destructive'
            className='bg-red-100 text-red-800 border-red-200'
          >
            <XCircle size={12} className='mr-1' />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant='outline'>Unknown</Badge>;
    }
  };

  const handleSelectClinic = (clinicId: string) => {
    setSelectedClinics((prev) =>
      prev.includes(clinicId)
        ? prev.filter((id) => id !== clinicId)
        : [...prev, clinicId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClinics.length === filteredClinics.length) {
      setSelectedClinics([]);
    } else {
      setSelectedClinics(filteredClinics.map((clinic) => clinic.id));
    }
  };

  // Calculate stats
  const stats = {
    total: clinics.length,
    verified: clinics.filter((c) => c.verification_status === 'verified')
      .length,
    pending: clinics.filter((c) => c.verification_status === 'pending').length,
    emergency: clinics.filter((c) => c.emergency).length,
  };

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Clinic Management
          </h1>
          <p className='text-gray-600'>
            Manage veterinary clinics and their information
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Button variant='outline' size='sm'>
            <Download size={16} className='mr-2' />
            Export
          </Button>
          <Button variant='outline' size='sm'>
            <Upload size={16} className='mr-2' />
            Import
          </Button>
          <Button size='sm' className='bg-emerald-600 hover:bg-emerald-700'>
            <Plus size={16} className='mr-2' />
            Add Clinic
          </Button>
        </div>
      </div>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Clinics
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.total}
                </p>
              </div>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                <MapPin className='w-6 h-6 text-blue-600' />
              </div>
            </div>
            <p className='text-xs text-green-600 mt-2'>+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Verified</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.verified}
                </p>
              </div>
              <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                <CheckCircle className='w-6 h-6 text-green-600' />
              </div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>
              {Math.round((stats.verified / stats.total) * 100)}% verification
              rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Pending</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.pending}
                </p>
              </div>
              <div className='w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center'>
                <Clock className='w-6 h-6 text-yellow-600' />
              </div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Emergency</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.emergency}
                </p>
              </div>
              <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
                <AlertCircle className='w-6 h-6 text-red-600' />
              </div>
            </div>
            <p className='text-xs text-gray-500 mt-2'>24/7 services</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle className='text-lg'>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Search clinics by name, city, or state...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-48'>
                <SelectValue placeholder='All Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='verified'>Verified</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='rejected'>Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className='w-48'>
                <SelectValue placeholder='All States' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All States</SelectItem>
                <SelectItem value='Kuala Lumpur'>Kuala Lumpur</SelectItem>
                <SelectItem value='Selangor'>Selangor</SelectItem>
                <SelectItem value='Johor'>Johor</SelectItem>
                <SelectItem value='Penang'>Penang</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clinics Table */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Clinics ({filteredClinics.length})</CardTitle>
            {selectedClinics.length > 0 && (
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-600'>
                  {selectedClinics.length} selected
                </span>
                <Button variant='outline' size='sm'>
                  Bulk Actions
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <LoadingSpinner size='lg' text='Loading clinics...' />
            </div>
          ) : (
            <div className='space-y-4'>
              {/* Table Header */}
              <div className='flex items-center py-3 px-4 bg-gray-50 rounded-lg font-medium text-sm text-gray-600'>
                <div className='w-8'>
                  <input
                    type='checkbox'
                    checked={
                      selectedClinics.length === filteredClinics.length &&
                      filteredClinics.length > 0
                    }
                    onChange={handleSelectAll}
                    className='rounded border-gray-300'
                  />
                </div>
                <div className='flex-1'>Clinic Name</div>
                <div className='w-48'>Location</div>
                <div className='w-32'>Status</div>
                <div className='w-32'>Emergency</div>
                <div className='w-32 text-center'>Actions</div>
              </div>

              {/* Table Rows */}
              {filteredClinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className='flex items-center py-4 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  <div className='w-8'>
                    <input
                      type='checkbox'
                      checked={selectedClinics.includes(clinic.id)}
                      onChange={() => handleSelectClinic(clinic.id)}
                      className='rounded border-gray-300'
                    />
                  </div>
                  <div className='flex-1'>
                    <div className='font-medium text-gray-900'>
                      {clinic.name}
                    </div>
                    <div className='text-sm text-gray-600 flex items-center gap-4 mt-1'>
                      <span className='flex items-center gap-1'>
                        <Phone size={12} />
                        {clinic.phone}
                      </span>
                      {clinic.website && (
                        <span className='flex items-center gap-1'>
                          <Globe size={12} />
                          <a
                            href={clinic.website}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:underline'
                          >
                            Website
                          </a>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='w-48'>
                    <div className='text-sm text-gray-900'>{clinic.city}</div>
                    <div className='text-xs text-gray-600'>{clinic.state}</div>
                  </div>
                  <div className='w-32'>
                    {getStatusBadge(clinic.verification_status)}
                  </div>
                  <div className='w-32'>
                    {clinic.emergency ? (
                      <Badge
                        variant='destructive'
                        className='bg-red-100 text-red-800 border-red-200'
                      >
                        <AlertCircle size={12} className='mr-1' />
                        24/7
                      </Badge>
                    ) : (
                      <Badge variant='outline'>Regular</Badge>
                    )}
                  </div>
                  <div className='w-32'>
                    <div className='flex items-center justify-center gap-1'>
                      <Button variant='ghost' size='sm' title='View Details'>
                        <Eye size={14} />
                      </Button>
                      <Button variant='ghost' size='sm' title='Edit Clinic'>
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-red-600 hover:text-red-800'
                        title='Delete Clinic'
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredClinics.length === 0 && !loading && (
                <div className='text-center py-12'>
                  <div className='text-gray-500 mb-2'>No clinics found</div>
                  <div className='text-sm text-gray-400'>
                    Try adjusting your search or filters
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
