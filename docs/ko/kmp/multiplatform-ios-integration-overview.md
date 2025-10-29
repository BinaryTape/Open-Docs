[//]: # (title: iOS 통합 방법)

Kotlin 멀티플랫폼 공유 모듈을 iOS 앱에 통합할 수 있습니다. 이를 위해 공유 모듈에서 [iOS 프레임워크](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html)를 생성한 다음, 이를 iOS 프로젝트에 의존성으로 추가합니다.

![iOS integration scheme](ios-integration-scheme.svg)

이 프레임워크를 로컬 또는 원격 의존성으로 사용할 수 있습니다. 전체 코드베이스를 완전히 제어하고 공통 코드가 변경될 때 최종 애플리케이션에 즉시 업데이트를 반영하려면 로컬 통합을 선택하세요.

최종 애플리케이션의 코드베이스를 공통 코드베이스와 명시적으로 분리하려면 원격 통합을 설정하세요. 이 경우 공유 코드는 일반적인 서드파티 의존성처럼 최종 애플리케이션에 통합됩니다.

## 로컬 통합

로컬 설정에는 두 가지 주요 통합 옵션이 있습니다. Kotlin 빌드를 iOS 빌드의 일부로 만드는 특별한 스크립트를 통한 직접 통합을 사용할 수 있습니다. Kotlin 멀티플랫폼 프로젝트에 Pod 의존성이 있다면 CocoaPods 통합 방식을 사용하세요.

### 직접 통합

Xcode 프로젝트에 특별한 스크립트를 추가하여 Kotlin 멀티플랫폼 프로젝트에서 iOS 프레임워크를 직접 연결할 수 있습니다. 이 스크립트는 프로젝트 빌드 설정의 빌드 단계에 통합됩니다.

이 통합 방식은 Kotlin 멀티플랫폼 프로젝트에서 CocoaPods 의존성을 **가져오지 않는** 경우에 적합합니다.

[Kotlin 멀티플랫폼 IDE 플러그인](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)을 사용하는 경우 직접 통합이 기본적으로 적용됩니다.

자세한 내용은 [직접 통합](multiplatform-direct-integration.md)을 참조하세요.

### 로컬 팟스펙(podspec)을 사용한 CocoaPods 통합

Swift 및 Objective-C 프로젝트의 인기 있는 의존성 관리자인 [CocoaPods](https://cocoapods.org/)를 통해 Kotlin 멀티플랫폼 프로젝트에서 iOS 프레임워크를 연결할 수 있습니다.

이 통합 방식은 다음 경우에 적합합니다.

*   CocoaPods를 사용하는 iOS 프로젝트와 함께 모노 리포지토리(mono repository) 설정을 가지고 있는 경우
*   Kotlin 멀티플랫폼 프로젝트에서 CocoaPods 의존성을 가져오는 경우

로컬 CocoaPods 의존성을 사용하는 워크플로(workflow)를 설정하려면 스크립트를 수동으로 편집할 수 있습니다.

자세한 내용은 [CocoaPods 개요 및 설정](multiplatform-cocoapods-overview.md)을 참조하세요.

## 원격 통합

원격 통합의 경우, 프로젝트는 Swift Package Manager (SPM) 또는 CocoaPods 의존성 관리자를 사용하여 Kotlin 멀티플랫폼 프로젝트에서 iOS 프레임워크를 연결할 수 있습니다.

### XCFrameworks를 사용한 Swift Package Manager

XCFrameworks를 사용하여 Swift Package Manager (SPM) 의존성을 설정함으로써 Kotlin 멀티플랫폼 프로젝트에서 iOS 프레임워크를 연결할 수 있습니다.

자세한 내용은 [Swift 패키지 내보내기 설정](multiplatform-spm-export.md)을 참조하세요.

### XCFrameworks를 사용한 CocoaPods 통합

Kotlin CocoaPods Gradle 플러그인을 사용하여 XCFrameworks를 빌드한 다음, CocoaPods를 통해 프로젝트의 공유 부분을 모바일 앱과 별도로 배포할 수 있습니다.

자세한 내용은 [최종 네이티브 바이너리 빌드](multiplatform-build-native-binaries.md#build-frameworks)를 참조하세요.