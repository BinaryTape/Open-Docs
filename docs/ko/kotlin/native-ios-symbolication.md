---
title: "iOS 크래시 리포트 심볼리케이션"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

iOS 애플리케이션 크래시 디버깅은 때때로 크래시 리포트 분석을 포함합니다.
크래시 리포트에 대한 자세한 내용은 [Apple documentation](https://developer.apple.com/library/archive/technotes/tn2151/_index.html)에서 확인할 수 있습니다.

크래시 리포트는 일반적으로 제대로 읽을 수 있도록 심볼리케이션이 필요합니다.
심볼리케이션은 머신 코드 주소를 사람이 읽을 수 있는 소스 위치로 변환합니다.
아래 문서는 Kotlin을 사용하는 iOS 애플리케이션의 크래시 리포트 심볼리케이션에 대한 몇 가지 구체적인 세부 정보를 설명합니다.

## 릴리스 Kotlin 바이너리에 대한 .dSYM 생성

Kotlin 코드의 주소를 심볼리케이션하려면 (예: Kotlin 코드에 해당하는 스택 추적 요소의 경우) Kotlin 코드에 대한 `.dSYM` 번들이 필요합니다.

기본적으로 Kotlin/Native 컴파일러는 Darwin 플랫폼에서 릴리스 (즉, 최적화된) 바이너리에 대한 `.dSYM`을 생성합니다. 이는 `-Xadd-light-debug=disable` 컴파일러 플래그로 비활성화할 수 있습니다. 동시에 이 옵션은 다른 플랫폼에서는 기본적으로 비활성화되어 있습니다. 활성화하려면 `-Xadd-light-debug=enable` 컴파일러 옵션을 사용하십시오.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug=\{enable|disable\}"
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug=\{enable|disable\}"
        }
    }
}
```

</TabItem>
</Tabs>

IntelliJ IDEA 또는 AppCode 템플릿에서 생성된 프로젝트에서 이러한 `.dSYM` 번들은 Xcode에서 자동으로 검색됩니다.

## 비트코드에서 재구축할 때 프레임워크를 정적으로 만들기

비트코드에서 Kotlin으로 생성된 프레임워크를 재구축하면 원래의 `.dSYM`이 무효화됩니다.
로컬에서 수행되는 경우 크래시 리포트를 심볼리케이션할 때 업데이트된 `.dSYM`이 사용되는지 확인하십시오.

재구축이 App Store 측에서 수행되는 경우 재구축된 *동적* 프레임워크의 `.dSYM`은 폐기되고 App Store Connect에서 다운로드할 수 없는 것으로 보입니다.
이 경우 프레임워크를 정적으로 만들어야 할 수 있습니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.withType<org.jetbrains.kotlin.gradle.plugin.mpp.Framework> {
            isStatic = true
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.withType(org.jetbrains.kotlin.gradle.plugin.mpp.Framework) {
            isStatic = true
        }
    }
}
```

</TabItem>
</Tabs>