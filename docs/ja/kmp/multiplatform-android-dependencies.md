[//]: # (title: Android依存関係の追加)

Kotlin MultiplatformモジュールにAndroid固有の依存関係を追加するワークフローは、純粋なAndroidプロジェクトの場合と同じです。Gradleファイルで依存関係を宣言し、プロジェクトをインポートします。その後、Kotlinコードでその依存関係を使用できます。

Kotlin Multiplatformプロジェクトでは、特定のAndroidソースセットに追加することでAndroid依存関係を宣言することをお勧めします。そのために、プロジェクトの`shared`ディレクトリにある`build.gradle(.kts)`ファイルを更新してください。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        androidMain.dependencies {
            implementation("com.example.android:app-magic:12.3")
        }
    } 
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        androidMain {
            dependencies {
                implementation 'com.example.android:app-magic:12.3'
            }
        }
    }
}
```

</TabItem>
</Tabs>

Androidプロジェクトでトップレベルの依存関係であったものを、マルチプラットフォームプロジェクトの特定のソースセットに移動するのは、そのトップレベルの依存関係が非自明な構成名（configuration name）を持っていた場合、難しいかもしれません。例えば、Androidプロジェクトのトップレベルから`debugImplementation`依存関係を移動するには、`androidDebug`という名前のソースセットに実装依存関係を追加する必要があります。このような移行の問題に対処する手間を最小限に抑えるために、`android {}`ブロック内に`dependencies {}`ブロックを追加することができます。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    android {
        //...
        dependencies {
            implementation("com.example.android:app-magic:12.3")
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    android {
        //...
        dependencies {
            implementation 'com.example.android:app-magic:12.3'
        }
    }
}
```

</TabItem>
</Tabs>

ここで宣言された依存関係は、トップレベルのブロックで宣言された場合とまったく同じように扱われますが、このように宣言することで、ビルドスクリプト内でAndroidの依存関係を視覚的に分離し、混乱を避けることができます。

Androidプロジェクトで慣習的な方法である、スクリプトの最後にある独立した`dependencies {}`ブロックに依存関係を配置することもサポートされています。しかし、トップレベルのブロックにAndroidの依存関係を記述し、各ソースセットに他のターゲットの依存関係を記述するというビルドスクリプトの構成は、混乱を招く可能性が高いため、そうしないことを強く**推奨します**。

## 次のステップ

マルチプラットフォームプロジェクトでの依存関係の追加に関する他のリソースを確認し、以下について詳しく学びましょう：

* [Android公式ドキュメントでの依存関係の追加](https://developer.android.com/studio/build/dependencies)
* [マルチプラットフォームライブラリや他のマルチプラットフォームプロジェクトへの依存関係の追加](multiplatform-add-dependencies.md)
* [iOS依存関係の追加](multiplatform-ios-dependencies.md)