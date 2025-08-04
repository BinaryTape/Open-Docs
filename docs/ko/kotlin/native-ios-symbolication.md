[//]: # (title: iOS 크래시 보고서 심볼화)

iOS 애플리케이션 크래시 디버깅에는 때때로 크래시 보고서 분석이 포함됩니다.
크래시 보고서에 대한 자세한 정보는 [Apple 문서](https://developer.apple.com/library/archive/technotes/tn2151/_index.html)에서 찾을 수 있습니다.

크래시 보고서는 일반적으로 제대로 읽을 수 있도록 심볼화가 필요합니다. 심볼화는 머신 코드 주소를 사람이 읽을 수 있는 소스 위치로 변환합니다.
아래 문서는 Kotlin을 사용하는 iOS 애플리케이션의 크래시 보고서를 심볼화하는 방법에 대한 몇 가지 세부 정보를 설명합니다.

## 릴리스 Kotlin 바이너리용 .dSYM 생성

Kotlin 코드의 주소를 심볼화하려면(예: Kotlin 코드에 해당하는 스택 트레이스 요소의 경우) Kotlin 코드용 `.dSYM` 번들이 필요합니다.

기본적으로 Kotlin/Native 컴파일러는 Darwin 플랫폼에서 릴리스(즉, 최적화된) 바이너리용 `.dSYM`을 생성합니다. 이는 `-Xadd-light-debug=disable` 컴파일러 플래그를 사용하여 비활성화할 수 있습니다. 동시에 이 옵션은 다른 플랫폼에서는 기본적으로 비활성화되어 있습니다. 이를 활성화하려면 `-Xadd-light-debug=enable` 컴파일러 옵션을 사용하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

</tab>
</tabs>

IntelliJ IDEA 또는 AppCode 템플릿으로 생성된 프로젝트에서 이러한 `.dSYM` 번들은 Xcode에 의해 자동으로 감지됩니다.

## 비트코드에서 재빌드할 때 프레임워크를 정적으로 만들기

비트코드에서 Kotlin이 생성한 프레임워크를 재빌드하면 원래의 `.dSYM`이 무효화됩니다.
로컬에서 수행되는 경우, 크래시 보고서를 심볼화할 때 업데이트된 `.dSYM`이 사용되는지 확인하십시오.

재빌드가 App Store 측에서 수행되는 경우, 재빌드된 *동적* 프레임워크의 `.dSYM`은 버려지는 것 같으며 App Store Connect에서 다운로드할 수 없습니다.
이 경우 프레임워크를 정적으로 만들 필요가 있을 수 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.withType<org.jetbrains.kotlin.gradle.plugin.mpp.Framework> {
            isStatic = true
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.withType(org.jetbrains.kotlin.gradle.plugin.mpp.Framework) {
            isStatic = true
        }
    }
}
```

</tab>
</tabs>