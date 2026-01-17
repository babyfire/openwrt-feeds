#
# Copyright (C) 2025-2026 BabyFire <babyfire@email.com>
#
# Licensed to the public under the GPL V3 License.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=nethogs
PKG_VERSION:=0.8.8
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://codeload.github.com/raboof/nethogs/tar.gz/refs/tags/v$(PKG_VERSION)?
PKG_HASH:=111ade20cc545e8dfd7ce4e293bd6b31cd1678a989b6a730bd2fa2acc6254818

PKG_MAINTAINER:=BabyFire <babyfire@email.com>
PKG_LICENSE:=GPL-2.0
PKG_LICENSE_FILES:=COPYING

PKG_BUILD_PARALLEL:=1
PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)


include $(INCLUDE_DIR)/package.mk

define Package/nethogs
  SECTION:=net
  CATEGORY:=Network
  TITLE:=Nethogs is a small net top tool.
  DEPENDS:=+libpcap +libncurses +libstdcpp
  URL:=https://github.com/raboof/nethogs
endef

define Package/nethogs/description
  NetHogs is a small 'net top' tool. Instead of breaking the traffic down per protocol
  or per subnet, like most tools do, it groups bandwidth by process.
endef

define Build/Configure
	sed -i 's/VERSION := .*/VERSION := ${PKG_VERSION}/' ${PKG_BUILD_DIR}/Makefile
	$(call Build/Configure/Default)
endef

define Package/nethogs/install
	$(INSTALL_DIR) $(1)/usr/sbin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/src/nethogs $(1)/usr/sbin/
endef

$(eval $(call BuildPackage,nethogs))
