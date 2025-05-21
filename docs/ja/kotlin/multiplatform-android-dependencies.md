---
title: "Android の依存関係の追加"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin MultiplatformモジュールにAndroid固有の依存関係を追加するワークフローは、純粋なAndroidプロジェクトの場合と同じです。Gradleファイルで依存関係を宣言し、プロジェクトをインポートします。その後、この依存関係をKotlinコードで使用できます。

Kotlin MultiplatformプロジェクトでAndroidの依存関係を宣言する場合は、特定のAndroidソースセットに追加することをお勧めします。そのためには、プロジェクトの`shared`ディレクトリにある`build.gradle(.kts)`ファイルを更新します。

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

Androidプロジェクトのトップレベルの依存関係をマルチプラットフォームプロジェクトの特定のソースセットに移動することは、トップレベルの依存関係に自明でない構成名がある場合は難しい場合があります。たとえば、`debugImplementation`の依存関係をAndroidプロジェクトのトップレベルから移動するには、`androidDebug`という名前のソースセットに実装の依存関係を追加する必要があります。このような移行の問題に対処するために必要な労力を最小限に抑えるには、`androidTarget {}`ブロック内に`dependencies {}`ブロックを追加できます。

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

ここで宣言された依存関係は、トップレベルのブロックからの依存関係とまったく同じように扱われますが、このように宣言すると、Androidの依存関係がビルドスクリプト内で視覚的に分離され、混乱が少なくなります。

Androidプロジェクトに特有の方法で、スクリプトの最後にスタンドアロンの`dependencies {}`ブロックに依存関係を配置することもサポートされています。ただし、トップレベルのブロックにAndroidの依存関係があり、各ソースセットに他のターゲットの依存関係があるビルドスクリプトを構成すると混乱を招く可能性があるため、これを行うことは**強く**お勧めしません。

## 次は何をしますか？

マルチプラットフォームプロジェクトでの依存関係の追加に関するその他のリソースを確認し、以下について詳しく学んでください。

* [公式Androidドキュメントでの依存関係の追加](https://developer.android.com/studio/build/dependencies)
* [マルチプラットフォームライブラリまたはその他のマルチプラットフォームプロジェクトへの依存関係の追加](multiplatform-add-dependencies)
* [iOSの依存関係の追加](multiplatform-ios-dependencies)