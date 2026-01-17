#
# Copyright (C) 2025-2026 BabyFire <babyfire@email.com>
#
# Licensed to the public under the GPL V3 License.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=kms
PKG_VERSION:=svn1113
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://codeload.github.com/Wind4/vlmcsd/tar.gz/refs/tags/$(PKG_VERSION)?
PKG_HASH:=62f55c48f5de1249c2348ab6b96dabbe7e38899230954b0c8774efb01d9c42cc

PKG_MAINTAINER:=BabyFire <babyfire@email.com>

PKG_BUILD_PARALLEL:=1
PKG_BUILD_DIR:=$(BUILD_DIR)/vlmcsd-$(PKG_VERSION)

include $(INCLUDE_DIR)/package.mk

define Package/kms
  SECTION:=net
  CATEGORY:=Network
  TITLE:=Key Management Service.
  DEPENDS:=+libpthread
  URL:=https://github.com/Wind4/vlmcsd
endef

define Package/kms/description
  KMS for Microsoft Volume Activation.
endef

define Build/Compile
	$(MAKE) -C $(PKG_BUILD_DIR) \
		$(TARGET_CONFIGURE_OPTS) \
		CC="$(TARGET_CC_NOCACHE)" \
		CFLAGS="$(TARGET_CFLAGS) $(TARGET_CPPFLAGS) -Os -ffunction-sections -fdata-sections" \
		LDFLAGS="$(TARGET_LDFLAGS) -lpthread -Wl,--gc-sections" \
		NDEBUG=1 \
		VLMCSD_VERSION="$(PKG_VERSION)" \
		vlmcsd
endef

define Package/kms/conffiles
	/etc/config/kms
	/etc/kms/kms.ini
	/etc/kms/kms.kmd
endef

define Package/kms/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/bin/vlmcsd $(1)/usr/bin/kms

	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_CONF) $(CURDIR)/files/kms.config $(1)/etc/config/kms

	$(INSTALL_DIR) $(1)/etc/kms
	$(INSTALL_CONF) $(PKG_BUILD_DIR)/etc/vlmcsd.ini $(1)/etc/kms/kms.ini
	$(INSTALL_DATA) $(PKG_BUILD_DIR)/etc/vlmcsd.kmd $(1)/etc/kms/kms.kmd

	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) $(CURDIR)/files/kms.init $(1)/etc/init.d/kms
endef

$(eval $(call BuildPackage,kms))