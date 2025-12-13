include $(TOPDIR)/rules.mk

PKG_NAME:=vlmcsd
PKG_VERSION:=svn1113
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://codeload.github.com/Wind4/vlmcsd/tar.gz/$(PKG_VERSION)?
PKG_HASH:=62f55c48f5de1249c2348ab6b96dabbe7e38899230954b0c8774efb01d9c42cc

PKG_MAINTAINER:=babyfire <ieric@163.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)

include $(INCLUDE_DIR)/package.mk

define Package/vlmcsd
	SECTION:=net
	CATEGORY:=Network
	TITLE:=vlmcsd for OpenWRT
	URL:=https://github.com/Wind4/vlmcsd
	DEPENDS:=+libpthread
endef

define Package/vlmcsd/description
	KMS emulator for Microsoft Volume Activation.
endef

define Build/Compile
	$(MAKE) -C $(PKG_BUILD_DIR) \
		CC="$(TARGET_CC)" \
		CFLAGS="$(TARGET_CFLAGS) $(TARGET_CPPFLAGS) -Wall -Wextra -O2" \
		LDFLAGS="$(TARGET_LDFLAGS) -lpthread" \
		vlmcsd
endef

define Package/vlmcsd/conffiles
	/etc/config/vlmcsd
endef

define Package/vlmcsd/install
	$(INSTALL_DIR) $(1)/usr/sbin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/bin/vlmcsd $(1)/usr/sbin/vlmcsd

	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_CONF) $(CURDIR)/files/vlmcsd.config $(1)/etc/config/vlmcsd

	$(INSTALL_DIR) $(1)/etc/vlmcsd
	$(INSTALL_CONF) $(PKG_BUILD_DIR)/etc/vlmcsd.ini $(1)/etc/vlmcsd/vlmcsd.ini
	$(INSTALL_DATA) $(PKG_BUILD_DIR)/etc/vlmcsd.kmd $(1)/etc/vlmcsd/vlmcsd.kmd

	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) $(CURDIR)/files/vlmcsd.init $(1)/etc/init.d/vlmcsd
endef

$(eval $(call BuildPackage,vlmcsd))
