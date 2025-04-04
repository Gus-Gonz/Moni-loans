import logging

from django.contrib.auth.models import Group, Permission, User
from django.db.models.signals import post_migrate
from django.contrib.contenttypes.models import ContentType
from django.dispatch import receiver

logger = logging.getLogger(__name__)


def create_default_groups():
    """Creates default groups and assigns necessary permissions."""

    if Group.objects.filter(name="Admin").exists():
        return

    admin_group = Group.objects.create(name="Admin")
    analyst_group = Group.objects.create(name="Analyst")

    ct = ContentType.objects.get_for_model(User)

    view_loan_perm, _ = Permission.objects.get_or_create(
        codename="view_loan",
        name="Can view loan request",
        content_type=ct
    )

    update_loan_perm, _ = Permission.objects.get_or_create(
        codename="update_loan",
        name="Can update loan request",
        content_type=ct
    )

    admin_group.permissions.add(view_loan_perm, update_loan_perm)
    analyst_group.permissions.add(view_loan_perm)

    logger.info("✅ Default groups and permissions created successfully.")


def create_default_users():
    admin_group = Group.objects.filter(name="Admin").first()
    analyst_group = Group.objects.filter(name="Analyst").first()

    if admin_group and not User.objects.filter(username="admin").exists():
        admin_user = User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="Admin1234"
        )
        admin_user.groups.add(admin_group)
        logger.info("✅ Admin user created: admin / Admin1234")

    if analyst_group and not User.objects.filter(username="analyst").exists():
        analyst_user = User.objects.create_superuser(
            username="analyst",
            email="analyst@example.com",
            password="Analyst1234"
        )
        analyst_user.groups.add(analyst_group)
        logger.info("✅ Analyst user created: analyst / Analyst1234")


@receiver(post_migrate)
def populate_users_and_roles(sender, **kwargs):
    create_default_groups()
    create_default_users()
