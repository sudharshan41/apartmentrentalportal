from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    role = db.Column(db.String(20), nullable=False, default='resident')  # admin, resident
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    bookings = db.relationship('Booking', back_populates='user', lazy=True)
    leases = db.relationship('Lease', back_populates='tenant', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'phone': self.phone,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Tower(db.Model):
    __tablename__ = 'towers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    total_floors = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    units = db.relationship('Unit', back_populates='tower', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'total_floors': self.total_floors,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'total_units': len(self.units)
        }


class Unit(db.Model):
    __tablename__ = 'units'
    
    id = db.Column(db.Integer, primary_key=True)
    tower_id = db.Column(db.Integer, db.ForeignKey('towers.id'), nullable=False)
    unit_number = db.Column(db.String(20), nullable=False)
    floor = db.Column(db.Integer, nullable=False)
    bedrooms = db.Column(db.Integer, nullable=False)
    bathrooms = db.Column(db.Integer, nullable=False)
    area_sqft = db.Column(db.Float, nullable=False)
    rent_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='available')  # available, occupied, maintenance
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    tower = db.relationship('Tower', back_populates='units')
    leases = db.relationship('Lease', back_populates='unit', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'tower_id': self.tower_id,
            'tower_name': self.tower.name if self.tower else None,
            'unit_number': self.unit_number,
            'floor': self.floor,
            'bedrooms': self.bedrooms,
            'bathrooms': self.bathrooms,
            'area_sqft': self.area_sqft,
            'rent_amount': self.rent_amount,
            'status': self.status,
            'description': self.description,
            'image_url': self.image_url,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Amenity(db.Model):
    __tablename__ = 'amenities'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    capacity = db.Column(db.Integer)
    available = db.Column(db.Boolean, default=True)
    icon = db.Column(db.String(50))
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    bookings = db.relationship('Booking', back_populates='amenity', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'capacity': self.capacity,
            'available': self.available,
            'icon': self.icon,
            'image_url': self.image_url,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amenity_id = db.Column(db.Integer, db.ForeignKey('amenities.id'), nullable=False)
    booking_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, approved, declined, cancelled
    notes = db.Column(db.Text)
    admin_notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='bookings')
    amenity = db.relationship('Amenity', back_populates='bookings')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.full_name if self.user else None,
            'user_email': self.user.email if self.user else None,
            'amenity_id': self.amenity_id,
            'amenity_name': self.amenity.name if self.amenity else None,
            'booking_date': self.booking_date.isoformat() if self.booking_date else None,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'status': self.status,
            'notes': self.notes,
            'admin_notes': self.admin_notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Lease(db.Model):
    __tablename__ = 'leases'
    
    id = db.Column(db.Integer, primary_key=True)
    unit_id = db.Column(db.Integer, db.ForeignKey('units.id'), nullable=False)
    tenant_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    rent_amount = db.Column(db.Float, nullable=False)
    security_deposit = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='active')  # active, expired, terminated
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    unit = db.relationship('Unit', back_populates='leases')
    tenant = db.relationship('User', back_populates='leases')
    payments = db.relationship('Payment', back_populates='lease', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'unit_id': self.unit_id,
            'unit_number': self.unit.unit_number if self.unit else None,
            'tower_name': self.unit.tower.name if self.unit and self.unit.tower else None,
            'tenant_id': self.tenant_id,
            'tenant_name': self.tenant.full_name if self.tenant else None,
            'tenant_email': self.tenant.email if self.tenant else None,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'rent_amount': self.rent_amount,
            'security_deposit': self.security_deposit,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Payment(db.Model):
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    lease_id = db.Column(db.Integer, db.ForeignKey('leases.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.Date, nullable=False)
    payment_method = db.Column(db.String(50))
    status = db.Column(db.String(20), default='pending')  # pending, completed, failed
    transaction_id = db.Column(db.String(100))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    lease = db.relationship('Lease', back_populates='payments')
    
    def to_dict(self):
        return {
            'id': self.id,
            'lease_id': self.lease_id,
            'amount': self.amount,
            'payment_date': self.payment_date.isoformat() if self.payment_date else None,
            'payment_method': self.payment_method,
            'status': self.status,
            'transaction_id': self.transaction_id,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
