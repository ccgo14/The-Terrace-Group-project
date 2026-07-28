from .app import app
from ..models import db, User, Article, Category, Reaction, Follow

with app.app_context():
    print("Clearing old data...")
    # Delete in reverse order of foreign key dependencies
    db.session.query(Follow).delete()
    db.session.query(Reaction).delete()
    db.session.query(Article).delete()
    db.session.query(Category).delete()
    db.session.query(User).delete()
    
    db.session.commit()

    print("Seeding hardcoded users...")
    
    users = [
        User(
            first_name='John',
            last_name='Doe',
            username='johndoe',
            email='john.doe@example.com',
            password='Password123!',
            gender='Male',
            profile_pic='https://picsum.photos/seed/john/200',
            bio='Tech enthusiast and software developer working on full-stack web applications.',
            role='admin'
        ),
        User(
            first_name='Jane',
            last_name='Smith',
            username='janesmith',
            email='jane.smith@example.com',
            password='Password123!',
            gender='Female',
            profile_pic='https://picsum.photos/seed/jane/200',
            bio='UI/UX designer who loves clean design, modern architecture, and good coffee.',
            role='author'
        ),
        User(
            first_name='Alex',
            last_name='Johnson',
            username='alexj',
            email='alex.johnson@example.com',
            password='Password123!',
            gender='Non-binary',
            profile_pic='https://picsum.photos/seed/alex/200',
            bio='Data analyst exploring trend predictions and machine learning models.',
            role='user'
        ),
        User(
            first_name='Michael',
            last_name='Brown',
            username='mikebrown',
            email='michael.brown@example.com',
            password='Password123!',
            gender='Male',
            profile_pic='https://picsum.photos/seed/mike/200',
            bio='Cybersecurity researcher sharing insights on network privacy and ethical hacking.',
            role='author'
        ),
        User(
            first_name='Emily',
            last_name='Davis',
            username='emilydavis',
            email='emily.davis@example.com',
            password='Password123!',
            gender='Female',
            profile_pic='https://picsum.photos/seed/emily/200',
            bio='Content writer specialized in digital marketing strategies and brand storytelling.',
            role='user'
        ),
        User(
            first_name='David',
            last_name='Wilson',
            username='davidw',
            email='david.wilson@example.com',
            password='Password123!',
            gender='Male',
            profile_pic='https://picsum.photos/seed/david/200',
            bio='DevOps engineer building robust CI/CD pipelines and managing cloud servers.',
            role='admin'
        ),
        User(
            first_name='Sarah',
            last_name='Taylor',
            username='saraht',
            email='sarah.taylor@example.com',
            password='Password123!',
            gender='Female',
            profile_pic='https://picsum.photos/seed/sarah/200',
            bio='Mobile app developer working on cross-platform frameworks like React Native.',
            role='author'
        ),
        User(
            first_name='Chris',
            last_name='Anderson',
            username='canderson',
            email='chris.anderson@example.com',
            password='Password123!',
            gender='Male',
            profile_pic='https://picsum.photos/seed/chris/200',
            bio='Passionate open-source contributor and Python community organizer.',
            role='user'
        ),
        User(
            first_name='Amanda',
            last_name='Thomas',
            username='athomas',
            email='amanda.thomas@example.com',
            password='Password123!',
            gender='Female',
            profile_pic='https://picsum.photos/seed/amanda/200',
            bio='Product manager bridging technical requirements with user experience needs.',
            role='user'
        ),
        User(
            first_name='Daniel',
            last_name='Jackson',
            username='djackson',
            email='daniel.jackson@example.com',
            password='Password123!',
            gender='Male',
            profile_pic='https://picsum.photos/seed/daniel/200',
            bio='Game developer crafting 3D mechanics and exploring interactive storytelling.',
            role='author'
        ),
        User(
            first_name='Jessica',
            last_name='White',
            username='jesswhite',
            email='jessica.white@example.com',
            password='Password123!',
            gender='Female',
            profile_pic='https://picsum.photos/seed/jess/200',
            bio='Frontend engineer obsessed with CSS, animations, and accessible web standards.',
            role='user'
        ),
        User(
            first_name='Robert',
            last_name='Harris',
            username='rharris',
            email='robert.harris@example.com',
            password='Password123!',
            gender='Male',
            profile_pic='https://picsum.photos/seed/robert/200',
            bio='Backend architect focused on scalable microservices and relational databases.',
            role='user'
        ),
        User(
            first_name='Sophia',
            last_name='Martin',
            username='smartin',
            email='sophia.martin@example.com',
            password='Password123!',
            gender='Female',
            profile_pic='https://picsum.photos/seed/sophia/200',
            bio='Tech blogger covering the latest news in web development and cloud tech.',
            role='author'
        ),
        User(
            first_name='James',
            last_name='Clark',
            username='jclark',
            email='james.clark@example.com',
            password='Password123!',
            gender='Male',
            profile_pic='https://picsum.photos/seed/james/200',
            bio='Full-stack developer enjoying Flask backends and modern JavaScript frontends.',
            role='user'
        ),
        User(
            first_name='Olivia',
            last_name='Lewis',
            username='olewis',
            email='olivia.lewis@example.com',
            password='Password123!',
            gender='Female',
            profile_pic='https://picsum.photos/seed/olivia/200',
            bio='System administrator keeping cloud infrastructures running reliably around the clock.',
            role='user'
        )
    ]

    db.session.add_all(users)
    db.session.commit()

    print(f"Successfully seeded {len(users)} users!")