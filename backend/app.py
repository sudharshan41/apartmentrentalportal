from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from config import Config
from models import db, User, Tower, Unit, Amenity, Booking, Lease, Payment
from datetime import datetime, date, time
import os

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)
jwt = JWTManager(app)


# Helper function to get user ID as integer from JWT
def get_current_user_id():
    return int(get_jwt_identity())


# JWT error handlers
@jwt.unauthorized_loader
def unauthorized_callback(callback):
    print(f"Unauthorized: {callback}")
    return jsonify({'error': 'Missing or invalid authorization token'}), 401

@jwt.invalid_token_loader
def invalid_token_callback(callback):
    print(f"Invalid token: {callback}")
    return jsonify({'error': 'Invalid token'}), 401

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print(f"Expired token - Header: {jwt_header}, Payload: {jwt_payload}")
    return jsonify({'error': 'Token has expired'}), 401


# Initialize database and seed data
@app.before_request
def initialize_database():
    if not hasattr(app, 'db_initialized'):
        with app.app_context():
            db.create_all()
            seed_data()
            app.db_initialized = True


def seed_data():
    """Seed initial data if database is empty"""
    if User.query.first() is None:
        # Create admin user
        admin = User(
            email='admin@rental.com',
            full_name='Admin User',
            phone='1234567890',
            role='admin'
        )
        admin.set_password('admin123')
        
        # Create resident users
        resident1 = User(
            email='john@example.com',
            full_name='John Doe',
            phone='9876543210',
            role='resident'
        )
        resident1.set_password('user123')
        
        resident2 = User(
            email='jane@example.com',
            full_name='Jane Smith',
            phone='9876543211',
            role='resident'
        )
        resident2.set_password('user123')
        
        db.session.add_all([admin, resident1, resident2])
        
        # Create towers
        tower1 = Tower(
            name='Sunrise Tower',
            address='123 Main Street, Downtown',
            total_floors=15
        )
        
        tower2 = Tower(
            name='Sunset Tower',
            address='456 Oak Avenue, Uptown',
            total_floors=20
        )
        
        db.session.add_all([tower1, tower2])
        db.session.commit()
        
        # Create units
        units = [
            Unit(tower_id=tower1.id, unit_number='A-101', floor=1, bedrooms=2, bathrooms=2, 
                 area_sqft=1200, rent_amount=1500, status='available',
                 description='Spacious 2BHK with modern amenities and city view',
                 image_url='https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'),
            Unit(tower_id=tower1.id, unit_number='A-102', floor=1, bedrooms=3, bathrooms=2, 
                 area_sqft=1500, rent_amount=2000, status='available',
                 description='Luxurious 3BHK apartment with balcony',
                 image_url='https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'),
            Unit(tower_id=tower1.id, unit_number='A-201', floor=2, bedrooms=1, bathrooms=1, 
                 area_sqft=800, rent_amount=1000, status='occupied',
                 description='Cozy 1BHK perfect for singles or couples',
                 image_url='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'),
            Unit(tower_id=tower2.id, unit_number='B-101', floor=1, bedrooms=2, bathrooms=2, 
                 area_sqft=1300, rent_amount=1600, status='available',
                 description='Modern 2BHK with premium fittings',
                 image_url='https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'),
            Unit(tower_id=tower2.id, unit_number='B-301', floor=3, bedrooms=3, bathrooms=3, 
                 area_sqft=1800, rent_amount=2500, status='available',
                 description='Premium 3BHK penthouse with terrace',
                 image_url='https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'),
        ]
        db.session.add_all(units)
        
        # Create amenities
        amenities = [
            Amenity(name='Swimming Pool', description='Olympic size swimming pool with separate kids area',
                   capacity=50, available=True, icon='pool',
                   image_url='https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800'),
            Amenity(name='Gym', description='Fully equipped gym with modern fitness equipment',
                   capacity=30, available=True, icon='fitness_center',
                   image_url='https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'),
            Amenity(name='Parking', description='Covered parking with 24/7 security',
                   capacity=100, available=True, icon='local_parking',
                   image_url='https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800'),
            Amenity(name='Club House', description='Multi-purpose club house for events and gatherings',
                   capacity=80, available=True, icon='home',
                   image_url='https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800'),
            Amenity(name='Tennis Court', description='Professional tennis court with lighting',
                   capacity=4, available=True, icon='sports_tennis',
                   image_url='https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800'),
            Amenity(name='Kids Play Area', description='Safe and fun play area for children',
                   capacity=20, available=True, icon='child_care',
                   image_url='https://images.unsplash.com/photo-1587845750216-13825d79fadb?w=800'),
        ]
        db.session.add_all(amenities)
        db.session.commit()
        
        # Create sample lease
        lease1 = Lease(
            unit_id=units[2].id,
            tenant_id=resident1.id,
            start_date=date(2024, 1, 1),
            end_date=date(2024, 12, 31),
            rent_amount=1000,
            security_deposit=2000,
            status='active'
        )
        db.session.add(lease1)
        db.session.commit()
        
        # Create sample payments
        payments = [
            Payment(lease_id=lease1.id, amount=1000, payment_date=date(2024, 1, 5),
                   payment_method='Credit Card', status='completed', transaction_id='TXN001'),
            Payment(lease_id=lease1.id, amount=1000, payment_date=date(2024, 2, 5),
                   payment_method='Bank Transfer', status='completed', transaction_id='TXN002'),
            Payment(lease_id=lease1.id, amount=1000, payment_date=date(2024, 3, 5),
                   payment_method='Credit Card', status='completed', transaction_id='TXN003'),
        ]
        db.session.add_all(payments)
        
        # Create sample bookings
        bookings = [
            Booking(user_id=resident1.id, amenity_id=amenities[0].id,
                   booking_date=date.today(), start_time=time(10, 0), end_time=time(11, 0),
                   status='approved', notes='Morning swim session'),
            Booking(user_id=resident2.id, amenity_id=amenities[1].id,
                   booking_date=date.today(), start_time=time(18, 0), end_time=time(19, 0),
                   status='pending', notes='Evening workout'),
        ]
        db.session.add_all(bookings)
        
        db.session.commit()
        print("Database seeded successfully!")


# ============= Authentication Routes =============

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    user = User(
        email=data.get('email'),
        full_name=data.get('full_name'),
        phone=data.get('phone'),
        role='resident'
    )
    user.set_password(data.get('password'))
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully', 'user': user.to_dict()}), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if not user or not user.check_password(data.get('password')):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    access_token = create_access_token(identity=str(user.id))
    print(f"Login successful - User ID: {user.id}, Email: {user.email}, Role: {user.role}")
    print(f"Generated token: {access_token[:50]}...")
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    }), 200


@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_current_user_id()
        print(f"Auth/me - User ID from JWT: {user_id}")
        user = User.query.get(user_id)
        
        if not user:
            print(f"Auth/me - User not found for ID: {user_id}")
            return jsonify({'error': 'User not found'}), 404
        
        print(f"Auth/me - User found: {user.email}")
        return jsonify(user.to_dict()), 200
    except Exception as e:
        print(f"Auth/me - Error: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ============= Tower Routes =============

@app.route('/api/towers', methods=['GET'])
def get_towers():
    towers = Tower.query.all()
    return jsonify([tower.to_dict() for tower in towers]), 200


@app.route('/api/towers/<int:tower_id>', methods=['GET'])
def get_tower(tower_id):
    tower = Tower.query.get_or_404(tower_id)
    return jsonify(tower.to_dict()), 200


@app.route('/api/towers', methods=['POST'])
@jwt_required()
def create_tower():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    tower = Tower(
        name=data.get('name'),
        address=data.get('address'),
        total_floors=data.get('total_floors')
    )
    
    db.session.add(tower)
    db.session.commit()
    
    return jsonify(tower.to_dict()), 201


@app.route('/api/towers/<int:tower_id>', methods=['PUT'])
@jwt_required()
def update_tower(tower_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    tower = Tower.query.get_or_404(tower_id)
    data = request.get_json()
    
    tower.name = data.get('name', tower.name)
    tower.address = data.get('address', tower.address)
    tower.total_floors = data.get('total_floors', tower.total_floors)
    
    db.session.commit()
    return jsonify(tower.to_dict()), 200


@app.route('/api/towers/<int:tower_id>', methods=['DELETE'])
@jwt_required()
def delete_tower(tower_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    tower = Tower.query.get_or_404(tower_id)
    db.session.delete(tower)
    db.session.commit()
    
    return jsonify({'message': 'Tower deleted successfully'}), 200


# ============= Unit Routes =============

@app.route('/api/units', methods=['GET'])
def get_units():
    status = request.args.get('status')
    tower_id = request.args.get('tower_id')
    
    query = Unit.query
    
    if status:
        query = query.filter_by(status=status)
    if tower_id:
        query = query.filter_by(tower_id=tower_id)
    
    units = query.all()
    return jsonify([unit.to_dict() for unit in units]), 200


@app.route('/api/units/<int:unit_id>', methods=['GET'])
def get_unit(unit_id):
    unit = Unit.query.get_or_404(unit_id)
    return jsonify(unit.to_dict()), 200


@app.route('/api/units', methods=['POST'])
@jwt_required()
def create_unit():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    unit = Unit(
        tower_id=data.get('tower_id'),
        unit_number=data.get('unit_number'),
        floor=data.get('floor'),
        bedrooms=data.get('bedrooms'),
        bathrooms=data.get('bathrooms'),
        area_sqft=data.get('area_sqft'),
        rent_amount=data.get('rent_amount'),
        status=data.get('status', 'available'),
        description=data.get('description'),
        image_url=data.get('image_url')
    )
    
    db.session.add(unit)
    db.session.commit()
    
    return jsonify(unit.to_dict()), 201


@app.route('/api/units/<int:unit_id>', methods=['PUT'])
@jwt_required()
def update_unit(unit_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    unit = Unit.query.get_or_404(unit_id)
    data = request.get_json()
    
    unit.tower_id = data.get('tower_id', unit.tower_id)
    unit.unit_number = data.get('unit_number', unit.unit_number)
    unit.floor = data.get('floor', unit.floor)
    unit.bedrooms = data.get('bedrooms', unit.bedrooms)
    unit.bathrooms = data.get('bathrooms', unit.bathrooms)
    unit.area_sqft = data.get('area_sqft', unit.area_sqft)
    unit.rent_amount = data.get('rent_amount', unit.rent_amount)
    unit.status = data.get('status', unit.status)
    unit.description = data.get('description', unit.description)
    unit.image_url = data.get('image_url', unit.image_url)
    
    db.session.commit()
    return jsonify(unit.to_dict()), 200


@app.route('/api/units/<int:unit_id>', methods=['DELETE'])
@jwt_required()
def delete_unit(unit_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    unit = Unit.query.get_or_404(unit_id)
    db.session.delete(unit)
    db.session.commit()
    
    return jsonify({'message': 'Unit deleted successfully'}), 200


# ============= Amenity Routes =============

@app.route('/api/amenities', methods=['GET'])
def get_amenities():
    amenities = Amenity.query.all()
    return jsonify([amenity.to_dict() for amenity in amenities]), 200


@app.route('/api/amenities/<int:amenity_id>', methods=['GET'])
def get_amenity(amenity_id):
    amenity = Amenity.query.get_or_404(amenity_id)
    return jsonify(amenity.to_dict()), 200


@app.route('/api/amenities', methods=['POST'])
@jwt_required()
def create_amenity():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    amenity = Amenity(
        name=data.get('name'),
        description=data.get('description'),
        capacity=data.get('capacity'),
        available=data.get('available', True),
        icon=data.get('icon'),
        image_url=data.get('image_url')
    )
    
    db.session.add(amenity)
    db.session.commit()
    
    return jsonify(amenity.to_dict()), 201


@app.route('/api/amenities/<int:amenity_id>', methods=['PUT'])
@jwt_required()
def update_amenity(amenity_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    amenity = Amenity.query.get_or_404(amenity_id)
    data = request.get_json()
    
    amenity.name = data.get('name', amenity.name)
    amenity.description = data.get('description', amenity.description)
    amenity.capacity = data.get('capacity', amenity.capacity)
    amenity.available = data.get('available', amenity.available)
    amenity.icon = data.get('icon', amenity.icon)
    amenity.image_url = data.get('image_url', amenity.image_url)
    
    db.session.commit()
    return jsonify(amenity.to_dict()), 200


@app.route('/api/amenities/<int:amenity_id>', methods=['DELETE'])
@jwt_required()
def delete_amenity(amenity_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    amenity = Amenity.query.get_or_404(amenity_id)
    db.session.delete(amenity)
    db.session.commit()
    
    return jsonify({'message': 'Amenity deleted successfully'}), 200


# ============= Booking Routes =============

@app.route('/api/bookings', methods=['GET'])
@jwt_required()
def get_bookings():
    try:
        print(f"Bookings request - Authorization header: {request.headers.get('Authorization', 'NOT FOUND')}")
        user_id = get_current_user_id()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if user.role == 'admin':
            bookings = Booking.query.order_by(Booking.created_at.desc()).all()
        else:
            bookings = Booking.query.filter_by(user_id=user_id).order_by(Booking.created_at.desc()).all()
        
        return jsonify([booking.to_dict() for booking in bookings]), 200
    except Exception as e:
        print(f"Bookings error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/bookings/<int:booking_id>', methods=['GET'])
@jwt_required()
def get_booking(booking_id):
    user_id = get_current_user_id()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    booking = Booking.query.get_or_404(booking_id)
    
    if user.role != 'admin' and booking.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify(booking.to_dict()), 200


@app.route('/api/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    user_id = get_current_user_id()
    data = request.get_json()
    
    booking = Booking(
        user_id=user_id,
        amenity_id=data.get('amenity_id'),
        booking_date=datetime.strptime(data.get('booking_date'), '%Y-%m-%d').date(),
        start_time=datetime.strptime(data.get('start_time'), '%H:%M').time(),
        end_time=datetime.strptime(data.get('end_time'), '%H:%M').time(),
        status='pending',
        notes=data.get('notes')
    )
    
    db.session.add(booking)
    db.session.commit()
    
    return jsonify(booking.to_dict()), 201


@app.route('/api/bookings/<int:booking_id>', methods=['PUT'])
@jwt_required()
def update_booking(booking_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    booking = Booking.query.get_or_404(booking_id)
    data = request.get_json()
    
    # Only admin can approve/decline, users can update their own bookings
    if user.role == 'admin':
        booking.status = data.get('status', booking.status)
        booking.admin_notes = data.get('admin_notes', booking.admin_notes)
    elif booking.user_id == user_id:
        booking.notes = data.get('notes', booking.notes)
        if booking.status == 'pending':
            booking.booking_date = datetime.strptime(data.get('booking_date'), '%Y-%m-%d').date() if data.get('booking_date') else booking.booking_date
            booking.start_time = datetime.strptime(data.get('start_time'), '%H:%M').time() if data.get('start_time') else booking.start_time
            booking.end_time = datetime.strptime(data.get('end_time'), '%H:%M').time() if data.get('end_time') else booking.end_time
    else:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.commit()
    return jsonify(booking.to_dict()), 200


@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
@jwt_required()
def delete_booking(booking_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    booking = Booking.query.get_or_404(booking_id)
    
    if user.role != 'admin' and booking.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(booking)
    db.session.commit()
    
    return jsonify({'message': 'Booking deleted successfully'}), 200


# ============= Lease Routes =============

@app.route('/api/leases', methods=['GET'])
@jwt_required()
def get_leases():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role == 'admin':
        leases = Lease.query.all()
    else:
        leases = Lease.query.filter_by(tenant_id=user_id).all()
    
    return jsonify([lease.to_dict() for lease in leases]), 200


@app.route('/api/leases/<int:lease_id>', methods=['GET'])
@jwt_required()
def get_lease(lease_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    lease = Lease.query.get_or_404(lease_id)
    
    if user.role != 'admin' and lease.tenant_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify(lease.to_dict()), 200


@app.route('/api/leases', methods=['POST'])
@jwt_required()
def create_lease():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    lease = Lease(
        unit_id=data.get('unit_id'),
        tenant_id=data.get('tenant_id'),
        start_date=datetime.strptime(data.get('start_date'), '%Y-%m-%d').date(),
        end_date=datetime.strptime(data.get('end_date'), '%Y-%m-%d').date(),
        rent_amount=data.get('rent_amount'),
        security_deposit=data.get('security_deposit'),
        status='active'
    )
    
    # Update unit status
    unit = Unit.query.get(data.get('unit_id'))
    if unit:
        unit.status = 'occupied'
    
    db.session.add(lease)
    db.session.commit()
    
    return jsonify(lease.to_dict()), 201


@app.route('/api/leases/<int:lease_id>', methods=['PUT'])
@jwt_required()
def update_lease(lease_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    lease = Lease.query.get_or_404(lease_id)
    data = request.get_json()
    
    lease.start_date = datetime.strptime(data.get('start_date'), '%Y-%m-%d').date() if data.get('start_date') else lease.start_date
    lease.end_date = datetime.strptime(data.get('end_date'), '%Y-%m-%d').date() if data.get('end_date') else lease.end_date
    lease.rent_amount = data.get('rent_amount', lease.rent_amount)
    lease.security_deposit = data.get('security_deposit', lease.security_deposit)
    lease.status = data.get('status', lease.status)
    
    db.session.commit()
    return jsonify(lease.to_dict()), 200


@app.route('/api/leases/<int:lease_id>', methods=['DELETE'])
@jwt_required()
def delete_lease(lease_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    lease = Lease.query.get_or_404(lease_id)
    
    # Update unit status
    unit = Unit.query.get(lease.unit_id)
    if unit:
        unit.status = 'available'
    
    db.session.delete(lease)
    db.session.commit()
    
    return jsonify({'message': 'Lease deleted successfully'}), 200


# ============= Payment Routes =============

@app.route('/api/payments', methods=['GET'])
@jwt_required()
def get_payments():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role == 'admin':
        payments = Payment.query.all()
    else:
        # Get payments for user's leases
        user_leases = Lease.query.filter_by(tenant_id=user_id).all()
        lease_ids = [lease.id for lease in user_leases]
        payments = Payment.query.filter(Payment.lease_id.in_(lease_ids)).all()
    
    return jsonify([payment.to_dict() for payment in payments]), 200


@app.route('/api/payments/<int:payment_id>', methods=['GET'])
@jwt_required()
def get_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    return jsonify(payment.to_dict()), 200


@app.route('/api/payments', methods=['POST'])
@jwt_required()
def create_payment():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    payment = Payment(
        lease_id=data.get('lease_id'),
        amount=data.get('amount'),
        payment_date=datetime.strptime(data.get('payment_date'), '%Y-%m-%d').date(),
        payment_method=data.get('payment_method'),
        status=data.get('status', 'pending'),
        transaction_id=data.get('transaction_id'),
        notes=data.get('notes')
    )
    
    db.session.add(payment)
    db.session.commit()
    
    return jsonify(payment.to_dict()), 201


# ============= Dashboard/Stats Routes =============

@app.route('/api/stats/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    try:
        user_id = get_current_user_id()
        print(f"Dashboard request - User ID from JWT: {user_id}")
        user = User.query.get(user_id)
        
        if not user:
            print(f"User not found for ID: {user_id}")
            return jsonify({'error': 'User not found'}), 404
        
        print(f"User found: {user.email}, Role: {user.role}")
        
        if user.role != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
    except Exception as e:
        print(f"Error in dashboard stats: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
    total_units = Unit.query.count()
    occupied_units = Unit.query.filter_by(status='occupied').count()
    available_units = Unit.query.filter_by(status='available').count()
    total_tenants = Lease.query.filter_by(status='active').count()
    pending_bookings = Booking.query.filter_by(status='pending').count()
    total_revenue = db.session.query(db.func.sum(Payment.amount)).filter_by(status='completed').scalar() or 0
    
    stats = {
        'total_units': total_units,
        'occupied_units': occupied_units,
        'available_units': available_units,
        'occupancy_rate': round((occupied_units / total_units * 100) if total_units > 0 else 0, 2),
        'total_tenants': total_tenants,
        'pending_bookings': pending_bookings,
        'total_revenue': total_revenue
    }
    
    return jsonify(stats), 200


@app.route('/api/users', methods=['GET'])
@jwt_required()
def get_users():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    users = User.query.filter_by(role='resident').all()
    return jsonify([user.to_dict() for user in users]), 200


# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Rental Portal API is running'}), 200


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
    )
