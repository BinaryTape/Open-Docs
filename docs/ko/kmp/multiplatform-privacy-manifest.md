[//]: # (title: iOS 앱용 개인 정보 처리 방침 매니페스트)

앱이 Apple App Store용이고 [필수 사유 API](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)를 사용하는 경우,
App Store Connect에서 앱에 올바른 개인 정보 처리 방침 매니페스트가 없다는 경고를 발행할 수 있습니다:

![필수 사유 경고](app-store-required-reasons-warning.png){width=700}

이는 네이티브 앱이든 멀티플랫폼 앱이든 모든 Apple 생태계 앱에 영향을 미칠 수 있습니다. 앱이 서드파티 라이브러리나 SDK를 통해 필수 사유 API를 사용할 수 있으며, 이는 명확하지 않을 수 있습니다. 코틀린 멀티플랫폼은 사용자가 알지 못하는 API를 사용하는 프레임워크 중 하나일 수 있습니다.

이 페이지에서는 문제에 대한 자세한 설명과 해결을 위한 권장 사항을 확인할 수 있습니다.

> 이 페이지는 코틀린 팀이 현재 이 문제에 대해 이해하고 있는 내용을 반영합니다.
> 허용된 접근 방식 및 해결 방법에 대한 더 많은 데이터와 정보를 얻게 되면, 해당 내용을 반영하도록 페이지를 업데이트할 예정입니다.
>
{style="tip"}

## 문제점

앱 스토어 제출에 대한 Apple의 요구 사항이 [2024년 봄에 변경되었습니다](https://developer.apple.com/news/?id=r1henawx).
[App Store Connect](https://appstoreconnect.apple.com)는 개인 정보 처리 방침 매니페스트에 필수 사유 API 사용에 대한 이유를 명시하지 않은 앱을 더 이상 허용하지 않습니다.

이는 수동 검토가 아닌 자동 확인입니다. 앱 코드가 분석되며, 이메일로 문제 목록을 받게 됩니다. 이메일에는 "ITMS-91053: Missing API declaration" 문제가 언급되며, 앱에서 사용된 API 카테고리 중 [필수 사유](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api) 카테고리에 해당하는 모든 목록이 나열됩니다.

이상적으로는 앱이 사용하는 모든 SDK가 자체 개인 정보 처리 방침 매니페스트를 제공하므로, 이에 대해 걱정할 필요가 없습니다. 하지만 일부 종속성이 이를 수행하지 않는 경우, 앱 스토어 제출이 거부될 수 있습니다.

## 해결 방법

앱 제출을 시도하고 앱 스토어로부터 자세한 문제 목록을 받은 후에는 Apple 문서를 참조하여 매니페스트를 구축할 수 있습니다:

*   [개인 정보 처리 방침 매니페스트 파일 개요](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files)
*   [개인 정보 처리 방침 매니페스트에서 데이터 사용 설명](https://developer.apple.com/documentation/bundleresources/describing-data-use-in-privacy-manifests)
*   [필수 사유 API 사용 설명](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)

결과 파일은 딕셔너리 모음입니다. 접근한 각 API 유형에 대해, 제공된 목록에서 하나 이상의 사용 사유를 선택하세요. Xcode는 시각적 레이아웃과 각 필드에 대한 유효한 값이 포함된 드롭다운 목록을 제공하여 `.xcprivacy` 파일을 편집하는 데 도움을 줍니다.

[특별한 도구](#find-usages-of-required-reason-apis)를 사용하여 코틀린 프레임워크의 종속성에서 필수 사유 API 사용을 찾고, [별도의 플러그인](#place-the-xcprivacy-file-in-your-kotlin-artifacts)을 사용하여 `.xcprivacy` 파일을 코틀린 아티팩트와 함께 번들링할 수 있습니다.

새로운 개인 정보 처리 방침 매니페스트가 앱 스토어 요구 사항을 충족하는 데 도움이 되지 않거나 단계를 진행하는 방법을 알 수 없는 경우, 저희에게 연락하여 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-67603)에 사례를 공유해 주세요.

## 필수 사유 API 사용량 찾기

앱의 코틀린 코드 또는 종속성 중 하나가 `platform.posix`와 같은 라이브러리에서 필수 사유 API(예: `fstat`)에 접근할 수 있습니다:

```kotlin
import platform.posix.fstat

fun useRequiredReasonAPI() {
    fstat(...)
}
```

어떤 종속성이 필수 사유 API를 사용하는지 파악하기 어려운 경우가 있습니다. 이를 찾는 데 도움을 드리기 위해 간단한 도구를 만들었습니다.

이 도구를 사용하려면 프로젝트에서 코틀린 프레임워크가 선언된 디렉터리에서 다음 명령을 실행하세요:

```shell
/usr/bin/python3 -c "$(curl -fsSL https://github.com/JetBrains/kotlin/raw/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)"
```

[이 스크립트](https://github.com/JetBrains/kotlin/blob/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)를 별도로 다운로드하여 검사한 다음 `python3`를 사용하여 실행할 수도 있습니다.

## .xcprivacy 파일을 코틀린 아티팩트에 배치하기

`PrivacyInfo.xcprivacy` 파일을 코틀린 아티팩트와 함께 번들링해야 하는 경우, `apple-privacy-manifests` 플러그인을 사용하세요:

```kotlin
plugins {
    kotlin("multiplatform")
    kotlin("apple-privacy-manifests") version "1.0.0"
}

kotlin {
    privacyManifest {
        embed(
            privacyManifest = layout.projectDirectory.file("PrivacyInfo.xcprivacy").asFile,
        )
    }
}
```

플러그인은 개인 정보 처리 방침 매니페스트 파일을 [해당 출력 위치](https://developer.apple.com/documentation/bundleresources/adding-a-privacy-manifest-to-your-app-or-third-party-sdk?language=objc)로 복사합니다.

## 알려진 사용 사례

### 컴포즈 멀티플랫폼

컴포즈 멀티플랫폼을 사용하면 바이너리에서 `fstat`, `stat`, `mach_absolute_time` 사용이 발생할 수 있습니다. 이러한 함수가 추적이나 핑거프린팅에 사용되지 않고 기기에서 전송되지 않더라도, Apple은 여전히 이들을 필수 사유가 누락된 API로 분류할 수 있습니다.

`stat` 및 `fstat` 사용에 대한 이유를 명시해야 하는 경우, `0A2A.1`을 사용하세요. `mach_absolute_time`의 경우 `35F9.1`을 사용하세요.

컴포즈 멀티플랫폼에서 사용되는 필수 사유 API에 대한 추가 업데이트는 [이 이슈](https://github.com/JetBrains/compose-multiplatform/issues/4738)를 참조하세요.

### 1.9.10 이하 버전의 코틀린/네이티브 런타임

`mach_absolute_time` API는 코틀린/네이티브 런타임의 `mimalloc` 할당자에서 사용됩니다. 이는 코틀린 1.9.10 및 이전 버전에서 기본 할당자였습니다.

코틀린 1.9.20 또는 이후 버전으로 업그레이드하는 것을 권장합니다. 업그레이드가 불가능한 경우, 메모리 할당자를 변경하세요. 이를 위해 현재 코틀린 할당자의 경우 Gradle 빌드 스크립트에서 `-Xallocator=custom` 컴파일 옵션을 설정하거나, 시스템 할당자의 경우 `-Xallocator=std`를 설정하세요.

자세한 내용은 [코틀린/네이티브 메모리 관리](https://kotlinlang.org/docs/native-memory-manager.html)를 참조하세요.