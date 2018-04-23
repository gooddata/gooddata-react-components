%global gdc_prefix /opt

Name:           gooddata-react-components-examples
Version:        3.%{gdcversion}
Release:        1%{dist}
Summary:        GoodData React Components Examples

Group:          Applications/Productivity
License:        Proprietary
URL:            https://github.com/gooddata/gooddata-react-components
Source0:        %{name}.tar.gz
BuildArch:      noarch
BuildRoot:      %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)

Requires:       httpd

%description
%{summary}

%prep
%setup -q -n %{name} -c

%install
rm -rf $RPM_BUILD_ROOT

mkdir -p $RPM_BUILD_ROOT%{gdc_prefix}/react-components-examples/
mkdir -p $RPM_BUILD_ROOT%{_sysconfdir}/httpd/conf.d
cp -a examples/dist/* $RPM_BUILD_ROOT%{gdc_prefix}/react-components-examples/

# httpd configuration
install -d $RPM_BUILD_ROOT%{_sysconfdir}/httpd/conf.d
tar -C httpd -cf - . |tar xf - -C \
    $RPM_BUILD_ROOT%{_sysconfdir}/httpd/conf.d

%clean
rm -rf $RPM_BUILD_ROOT

%files
%defattr(0644,root,root,0755)
%{_sysconfdir}/httpd/conf.d/*
%dir %{gdc_prefix}/react-components-examples
%{gdc_prefix}/react-components-examples/*

%changelog
