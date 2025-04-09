---
title: "Android 종속성 추가"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin Multiplatform 모듈에 Android 관련 종속성을 추가하는 워크플로는 순수 Android 프로젝트와 동일합니다. Gradle 파일에서 종속성을 선언하고 프로젝트를 임포트합니다. 그런 다음 Kotlin 코드에서 이 종속성을 사용할 수 있습니다.

Kotlin Multiplatform 프로젝트에서 Android 종속성을 선언할 때는 특정 Android 소스 세트에 추가하는 것이 좋습니다. 그러려면 프로젝트의 `shared` 디렉터리에서 `build.gradle(.kts)` 파일을 업데이트합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
sourceSets {
    androidMain.dependencies {
        implementation("com.example.android:app-magic:12.3")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
sourceSets {
    androidMain {
        dependencies {
            implementation 'com.example.android:app-magic:12.3'
        }
    }
}
```

</TabItem>
</Tabs>

Android 프로젝트에서 최상위 종속성이었던 것을 멀티플랫폼 프로젝트의 특정 소스 세트로 이동하는 것은 최상위 종속성의 구성 이름이 간단하지 않은 경우 어려울 수 있습니다. 예를 들어 `debugImplementation` 종속성을 Android 프로젝트의 최상위 수준에서 이동하려면 `androidDebug`라는 소스 세트에 implementation 종속성을 추가해야 합니다. 이러한 마이그레이션 문제를 처리하는 데 드는 노력을 최소화하려면 `androidTarget {}` 블록 안에 `dependencies {}` 블록을 추가하면 됩니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
androidTarget {
    //...
    dependencies {
        implementation("com.example.android:app-magic:12.3")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
androidTarget {
    //...
    dependencies {
        implementation 'com.example.android:app-magic:12.3'
    }
}
```

</TabItem>
</Tabs>

여기에 선언된 종속성은 최상위 블록의 종속성과 정확히 동일하게 취급되지만, 이러한 방식으로 선언하면 빌드 스크립트에서 Android 종속성을 시각적으로 분리하고 혼동을 줄일 수 있습니다.

Android 프로젝트에 관용적인 방식으로 스크립트 끝에 독립 실행형 `dependencies {}` 블록에 종속성을 넣는 것도 지원됩니다. 그러나 최상위 블록에 Android 종속성이 있고 각 소스 세트에 다른 대상 종속성이 있는 빌드 스크립트를 구성하면 혼동을 일으킬 수 있으므로 이렇게 하는 것을 **강력히 반대**합니다.

## 다음 단계

멀티플랫폼 프로젝트에서 종속성을 추가하는 방법에 대한 다른 리소스를 확인하고 다음에 대해 자세히 알아보세요.

* [공식 Android 문서에서 종속성 추가](https://developer.android.com/studio/build/dependencies)
* [멀티플랫폼 라이브러리 또는 기타 멀티플랫폼 프로젝트에 종속성 추가](multiplatform-add-dependencies)
* [iOS 종속성 추가](multiplatform-ios-dependencies)