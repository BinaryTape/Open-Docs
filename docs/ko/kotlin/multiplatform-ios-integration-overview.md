---
title: "iOS 통합 방법"
---
iOS 앱에 Kotlin Multiplatform 공유 모듈을 통합할 수 있습니다. 이를 위해 공유 모듈에서 [iOS framework](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)를 생성한 다음 iOS 프로젝트에 종속성으로 추가합니다.

<img src="/img/ios-integration-scheme.svg" alt="iOS integration scheme" style={{verticalAlign: 'middle'}}/>

이 framework는 로컬 또는 원격 종속성으로 사용할 수 있습니다. 전체 코드베이스를 완벽하게 제어하고 공통 코드가 변경될 때 최종 애플리케이션에 즉시 업데이트하려면 로컬 통합을 선택하십시오.

최종 애플리케이션의 코드 베이스를 공통 코드 베이스와 명시적으로 분리하려면 원격 통합을 설정하십시오. 이 경우 공유 코드는 일반 타사 종속성처럼 최종 애플리케이션에 통합됩니다.

## 로컬 통합

로컬 설정에는 두 가지 주요 통합 옵션이 있습니다. Kotlin 빌드를 iOS 빌드의 일부로 만드는 특수 스크립트를 통해 직접 통합을 사용할 수 있습니다. Kotlin Multiplatform 프로젝트에 Pod 종속성이 있는 경우 CocoaPods 통합 방식을 사용하십시오.

### 직접 통합

Xcode 프로젝트에 특수 스크립트를 추가하여 Kotlin Multiplatform 프로젝트에서 직접 iOS framework를 연결할 수 있습니다. 스크립트는 프로젝트 빌드 설정의 빌드 단계에 통합됩니다.

Kotlin Multiplatform 프로젝트에서 CocoaPods 종속성을 가져**오지 않는** 경우 이 통합 방법이 적합할 수 있습니다.

Android Studio에서 프로젝트를 생성하는 경우 **Regular framework** 옵션을 선택하여 이 설정을 자동으로 생성하십시오. [Kotlin Multiplatform web wizard](https://kmp.jetbrains.com/)를 사용하는 경우 직접 통합이 기본적으로 적용됩니다.

자세한 내용은 [Direct integration](multiplatform-direct-integration)을 참조하십시오.

### 로컬 podspec을 사용한 CocoaPods 통합

Swift 및 Objective-C 프로젝트를 위한 인기 있는 종속성 관리자인 [CocoaPods](https://cocoapods.org/)를 통해 Kotlin Multiplatform 프로젝트에서 iOS framework를 연결할 수 있습니다.

다음 경우에 이 통합 방법이 적합합니다.

* CocoaPods를 사용하는 iOS 프로젝트가 포함된 모노 레포지토리 설정이 있는 경우
* Kotlin Multiplatform 프로젝트에서 CocoaPods 종속성을 가져오는 경우

로컬 CocoaPods 종속성을 사용하여 워크플로우를 설정하려면 스크립트를 수동으로 편집하거나 Android Studio의 마법사를 사용하여 프로젝트를 생성할 수 있습니다.

자세한 내용은 [CocoaPods overview and setup](native-cocoapods)을 참조하십시오.

## 원격 통합

원격 통합의 경우 프로젝트에서 Swift Package Manager (SPM) 또는 CocoaPods 종속성 관리자를 사용하여 Kotlin Multiplatform 프로젝트에서 iOS framework를 연결할 수 있습니다.

### XCFramework를 사용한 Swift package manager

XCFramework를 사용하여 Swift package manager (SPM) 종속성을 설정하여 Kotlin Multiplatform 프로젝트에서 iOS framework를 연결할 수 있습니다.

자세한 내용은 [Swift package export setup](native-spm)을 참조하십시오.

### XCFramework를 사용한 CocoaPods 통합

Kotlin CocoaPods Gradle 플러그인을 사용하여 XCFramework를 빌드한 다음 CocoaPods를 통해 모바일 앱과 별도로 프로젝트의 공유 부분을 배포할 수 있습니다.

자세한 내용은 [Build final native binaries](multiplatform-build-native-binaries#build-frameworks)를 참조하십시오.