import sys
import os
from datetime import datetime, timedelta

# Ensure the server directory is in the Python path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from __init__ import create_app
from models import (
    db, User, Profile, Category, Article, Comment, 
    Reaction, Follow, League, Team, Match, Prediction
)

app = create_app()

if not app:
    raise RuntimeError("create_app() returned None — check your application factory.")

try:
    with app.app_context():
        print("Clearing old data...")
        # Delete in strict reverse order of foreign key dependencies
        db.session.query(Prediction).delete(synchronize_session=False)
        db.session.query(Match).delete(synchronize_session=False)
        db.session.query(Team).delete(synchronize_session=False)
        db.session.query(League).delete(synchronize_session=False)
        db.session.query(Follow).delete(synchronize_session=False)
        db.session.query(Reaction).delete(synchronize_session=False)
        db.session.query(Comment).delete(synchronize_session=False)
        db.session.query(Article).delete(synchronize_session=False)
        db.session.query(Category).delete(synchronize_session=False)
        db.session.query(Profile).delete(synchronize_session=False)
        db.session.query(User).delete(synchronize_session=False)
        db.session.commit()

        print("Seeding Users and Profiles...")
        users_data = [
            ("John", "Doe", "johndoe", "john.doe@example.com", "Male", "admin", "Tech enthusiast and software developer."),
            ("Jane", "Smith", "janesmith", "jane.smith@example.com", "Female", "author", "UI/UX designer who loves clean design."),
            ("Alex", "Johnson", "alexj", "alex.johnson@example.com", "Non-binary", "user", "Data analyst exploring trend predictions."),
            ("Michael", "Brown", "mikebrown", "michael.brown@example.com", "Male", "author", "Cybersecurity researcher sharing insights."),
            ("Emily", "Davis", "emilydavis", "emily.davis@example.com", "Female", "user", "Content writer specialized in digital marketing."),
        ]

        created_users = []
        for first, last, uname, email, gender, role, bio in users_data:
            user = User(
                first_name=first,
                last_name=last,
                username=uname,
                email=email,
            )
            user.set_password("Password123!")
            db.session.add(user)
            db.session.flush()

            profile = Profile(
                gender=gender,
                bio=bio,
                role=role,
                profile_pic=f"https://picsum.photos/seed/{uname}/200",
                user_id=user.user_id,
            )
            db.session.add(profile)
            created_users.append(user)

        db.session.commit()
        print(f"Seeded {len(created_users)} users with profiles.")

        print("Seeding Categories...")
        categories_data = [
            ("Technology", "cpu", "Latest advancements in software, hardware, and AI."),
            ("Sports", "trophy", "Match highlights, league standings, and sports predictions."),
            ("Design", "palette", "UI/UX trends, web accessibility, and graphic tips."),
            ("Cybersecurity", "shield", "Network privacy, vulnerability updates, and ethical hacking."),
        ]

        created_categories = []
        for name, icon, desc in categories_data:
            cat = Category(category_name=name, icon=icon, description=desc)
            db.session.add(cat)
            created_categories.append(cat)

        db.session.commit()
        print(f"Seeded {len(created_categories)} categories.")

        print("Seeding Articles...")
        articles_data = [
            (
                "The Future of Flask in 2026",
                "Flask continues to power modern lightweight microservices...",
                created_users[0].user_id,
                created_categories[0].category_id,
            ),
            (
                "Designing Accessible Web Apps",
                "Accessibility is no longer optional in modern frontend layouts...",
                created_users[1].user_id,
                created_categories[2].category_id,
            ),
            (
                "Premier League Title Race Analysis",
                "Breaking down the tactical setups of top contenders this season...",
                created_users[3].user_id,
                created_categories[1].category_id,
            ),
        ]

        created_articles = []
        for title, content, author_id, cat_id in articles_data:
            article = Article(
                title=title,
                content=content,
                author_id=author_id,
                category_id=cat_id,
                published_at=datetime.utcnow(),
            )
            db.session.add(article)
            created_articles.append(article)

        db.session.commit()
        print(f"Seeded {len(created_articles)} articles.")

        print("Seeding Comments & Reactions...")
        comment = Comment(
            content="Amazing read! Really learned a lot about modern architecture.",
            user_id=created_users[2].user_id,
            article_id=created_articles[0].article_id,
        )
        db.session.add(comment)

        reaction = Reaction(
            body="Very insightful breakdown!",
            reaction_type="thumbs_up",
            user_id=created_users[4].user_id,
            article_id=created_articles[0].article_id,
        )
        db.session.add(reaction)
        db.session.commit()

        print("Seeding Leagues, Teams & Matches...")
        league = League(name="Premier League", country="England", logo_url="https://placeholder.com/pl.png")
        db.session.add(league)
        db.session.flush()

        team_a = Team(name="Arsenal", short_code="ARS", league_id=league.id)
        team_b = Team(name="Chelsea", short_code="CHE", league_id=league.id)
        db.session.add_all([team_a, team_b])
        db.session.flush()

        match = Match(
            league_id=league.id,
            home_team_id=team_a.id,
            away_team_id=team_b.id,
            start_time=datetime.utcnow() + timedelta(days=1),
            status="UPCOMING",
        )
        db.session.add(match)
        db.session.flush()

        prediction = Prediction(
            user_id=created_users[2].user_id,
            match_id=match.id,
            predicted_home_score=2,
            predicted_away_score=1,
            status="PENDING",
        )
        db.session.add(prediction)
        db.session.commit()

        print("Database seeding completed successfully!")

except Exception as e:
    db.session.rollback()
    print(f"ERROR: Seeding failed — {e}")
    sys.exit(1)
