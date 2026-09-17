import org.gradle.api.tasks.Exec

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.saborrr.museumathome"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.saborrr.museumathome"
        minSdk = 21
        targetSdk = 35
        versionCode = 3
        versionName = "2.1.1"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.webkit:webkit:1.12.1")
}

val museumRoot = rootProject.projectDir.parentFile
val syncMuseumWebAssets by tasks.registering(Exec::class) {
    workingDir = museumRoot
    commandLine("node", "scripts/build-android-assets.js")
    inputs.files(
        fileTree(museumRoot.resolve("scripts")),
        fileTree(museumRoot.resolve("data")),
        fileTree(museumRoot.resolve("css")),
        fileTree(museumRoot.resolve("js")) {
            exclude("catalog.es5.js")
        },
        fileTree(museumRoot.resolve("img")),
        fileTree(museumRoot.resolve("docs")),
        museumRoot.resolve("index.html"),
        museumRoot.resolve("manifest.webmanifest"),
        museumRoot.resolve("sw.js")
    )
    outputs.dir(layout.projectDirectory.dir("src/main/assets"))
}

tasks.named("preBuild") {
    dependsOn(syncMuseumWebAssets)
}
